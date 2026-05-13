/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayAt } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getMemberPropertyName = (
    memberExpression: TSESTree.MemberExpression
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === AST_NODE_TYPES.Identifier
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === AST_NODE_TYPES.Literal &&
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
    expression.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    expression.type === AST_NODE_TYPES.FunctionExpression;

const hasInsecureCertificateOverride = (
    callbackNode:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression,
    context: TSESLint.RuleContext<MessageIds, unknown[]>,
    callbackParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);
    const escapedName = callbackParameterName.replaceAll(
        "$",
        // eslint-disable-next-line unicorn/prefer-string-raw -- Replacement callback avoids `$` replacement-token semantics.
        () => "\\$"
    );
    // eslint-disable-next-line security/detect-non-literal-regexp -- Callback identifier is escaped before interpolation for strict handler-call detection.
    const callbackPattern = new RegExp(
        String.raw`\b${escapedName}\s*\(\s*0\b`,
        "u"
    );

    return (
        callbackPattern.test(callbackSourceText) ||
        // eslint-disable-next-line regexp/require-unicode-sets-regexp -- `/v` is not yet parseable in the current TypeScript-ESLint parser stack.
        /\breturn\s+0\b/u.test(callbackSourceText)
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
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
                    firstArgument.type === AST_NODE_TYPES.SpreadElement ||
                    !isFunctionExpression(firstArgument)
                ) {
                    return;
                }

                const callbackParameter = arrayAt(firstArgument.params, -1);

                if (callbackParameter?.type !== AST_NODE_TYPES.Identifier) {
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Electron certificate verify proc callbacks that accept invalid certificates.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-insecure-certificate-verify-proc",
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
