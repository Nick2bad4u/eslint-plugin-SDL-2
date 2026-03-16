/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayAt } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getMemberPropertyName = (
    memberExpression: TSESTree.MemberExpression
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === "Identifier"
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === "Literal" &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return undefined;
};

const isFunctionExpression = (
    expression: TSESTree.CallExpressionArgument
): expression is
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression =>
    expression.type === "ArrowFunctionExpression" ||
    expression.type === "FunctionExpression";

const hasInsecureCertificateOverride = (
    callbackNode:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression,
    context: TSESLint.RuleContext<MessageIds, unknown[]>,
    callbackParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);
    const escapedName = callbackParameterName.replaceAll("$", String.raw`\$`);
    // eslint-disable-next-line security/detect-non-literal-regexp -- Callback identifier is escaped before interpolation for strict handler-call detection.
    const callbackPattern = new RegExp(
        String.raw`\b${escapedName}\s*\(\s*0\b`,
        "u"
    );

    return (
        callbackPattern.test(callbackSourceText) ||
        /\breturn\s+0\b/u.test(callbackSourceText)
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                if (
                    getMemberPropertyName(node.callee) !==
                    "setCertificateVerifyProc"
                ) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement" ||
                    !isFunctionExpression(firstArgument)
                ) {
                    return;
                }

                const callbackParameter = arrayAt(firstArgument.params, -1);

                if (callbackParameter?.type !== "Identifier") {
                    return;
                }

                if (
                    !hasInsecureCertificateOverride(
                        firstArgument,
                        context,
                        callbackParameter.name
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: firstArgument,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Electron certificate verify proc callbacks that accept invalid certificates.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-insecure-certificate-verify-proc",
        },
        messages: {
            default:
                "Do not override certificate verification by returning/callbacking with 0 in setCertificateVerifyProc handlers.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-insecure-certificate-verify-proc",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
