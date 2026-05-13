/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst } from "ts-extras";

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

const hasUnsafeAllowAction = (
    callbackNode:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression,
    context: TSESLint.RuleContext<MessageIds, unknown[]>
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);

    // eslint-disable-next-line regexp/require-unicode-sets-regexp -- `/v` is not yet parseable in the current TypeScript-ESLint parser stack.
    return /\baction\s*:\s*["'`]allow["'`]/u.test(callbackSourceText);
};

const hasPreventDefaultCall = (
    callbackNode:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression,
    context: TSESLint.RuleContext<MessageIds, unknown[]>,
    eventParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);
    const escapedName = eventParameterName.replaceAll(
        "$",
        // eslint-disable-next-line unicorn/prefer-string-raw -- Replacement callback avoids `$` replacement-token semantics.
        () => "\\$"
    );
    // eslint-disable-next-line security/detect-non-literal-regexp -- Event parameter identifier is escaped before interpolation for preventDefault-call detection.
    const preventDefaultPattern = new RegExp(
        String.raw`\b${escapedName}\s*\.\s*preventDefault\s*\(`,
        "u"
    );

    return preventDefaultPattern.test(callbackSourceText);
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
                    return;
                }

                const methodName = getMemberPropertyName(node.callee);

                if (methodName === "setWindowOpenHandler") {
                    const [firstArgument] = node.arguments;

                    if (
                        firstArgument === undefined ||
                        firstArgument.type === AST_NODE_TYPES.SpreadElement ||
                        !isFunctionExpression(firstArgument)
                    ) {
                        return;
                    }

                    if (!hasUnsafeAllowAction(firstArgument, context)) {
                        return;
                    }

                    context.report({
                        messageId: "default",
                        node: firstArgument,
                    });

                    return;
                }

                if (methodName !== "on") {
                    return;
                }

                const [firstArgument, secondArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === AST_NODE_TYPES.SpreadElement ||
                    secondArgument === undefined ||
                    secondArgument.type === AST_NODE_TYPES.SpreadElement ||
                    !isFunctionExpression(secondArgument)
                ) {
                    return;
                }

                if (
                    firstArgument.type !== AST_NODE_TYPES.Literal ||
                    firstArgument.value !== "will-navigate"
                ) {
                    return;
                }

                const eventParameter = arrayFirst(secondArgument.params);

                if (eventParameter?.type !== AST_NODE_TYPES.Identifier) {
                    return;
                }

                if (
                    hasPreventDefaultCall(
                        secondArgument,
                        context,
                        eventParameter.name
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: secondArgument,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Electron navigation handlers that allow unrestricted navigation or window opening.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-unrestricted-navigation",
        },
        messages: {
            default:
                "Restrict Electron navigation/window-opening handlers with explicit blocking or allowlist logic.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-unrestricted-navigation",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
