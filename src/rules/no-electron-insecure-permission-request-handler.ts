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

const hasUnsafePermissionAllowPattern = (
    callbackNode:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression,
    context: TSESLint.RuleContext<MessageIds, unknown[]>,
    callbackParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);
    const escapedName = callbackParameterName.replaceAll("$", String.raw`\$`);
    // eslint-disable-next-line security/detect-non-literal-regexp -- Callback identifier is escaped before interpolation for strict permission-allow detection.
    const callbackPattern = new RegExp(
        String.raw`\b${escapedName}\s*\(\s*true\b`,
        "u"
    );

    return (
        callbackPattern.test(callbackSourceText) ||
        /\breturn\s+true\b/u.test(callbackSourceText)
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                if (
                    getMemberPropertyName(node.callee) !==
                    "setPermissionRequestHandler"
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
                    !hasUnsafePermissionAllowPattern(
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Electron permission request handlers that blanket-allow permission requests.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-insecure-permission-request-handler",
        },
        messages: {
            default:
                "Do not blanket-allow permissions in setPermissionRequestHandler callbacks.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-insecure-permission-request-handler",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
