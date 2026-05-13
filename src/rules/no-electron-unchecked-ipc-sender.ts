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

const isIpcMainObjectExpression = (
    expression: TSESTree.Expression
): boolean => {
    if (expression.type === AST_NODE_TYPES.Identifier) {
        return expression.name === "ipcMain";
    }

    if (expression.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    return getMemberPropertyName(expression) === "ipcMain";
};

const isIpcMainHandlerRegistration = (
    node: TSESTree.CallExpression
): boolean => {
    if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    const methodName = getMemberPropertyName(node.callee);

    if (methodName !== "on" && methodName !== "handle") {
        return false;
    }

    return isIpcMainObjectExpression(node.callee.object);
};

const isFunctionExpression = (
    expression: TSESTree.CallExpressionArgument
): expression is
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression =>
    expression.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    expression.type === AST_NODE_TYPES.FunctionExpression;

const hasSenderValidationPattern = (
    callbackNode:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression,
    context: TSESLint.RuleContext<MessageIds, unknown[]>,
    eventParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);
    const escapedEventName = eventParameterName.replaceAll(
        "$",
        // eslint-disable-next-line etc-misc/no-unnecessary-template-literal -- String.raw preserves the intended regex-escape backslash.
        () => String.raw`\$`
    );
    // eslint-disable-next-line security/detect-non-literal-regexp -- Event parameter identifier is escaped before interpolation for sender-access detection.
    const eventSenderPattern = new RegExp(
        String.raw`\b${escapedEventName}\s*\.\s*(?:sender|senderFrame)\b`,
        "u"
    );

    return (
        eventSenderPattern.test(callbackSourceText) ||
        // eslint-disable-next-line regexp/require-unicode-sets-regexp -- `/v` is not yet parseable in the current TypeScript-ESLint parser stack.
        /\b(?:allowlist|getURL|isTrusted|origin|validate|whitelist)\b/u.test(
            callbackSourceText
        )
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isIpcMainHandlerRegistration(node)) {
                    return;
                }

                const [, handlerNode] = node.arguments;

                if (
                    handlerNode === undefined ||
                    handlerNode.type === AST_NODE_TYPES.SpreadElement ||
                    !isFunctionExpression(handlerNode)
                ) {
                    return;
                }

                const eventParameter = arrayFirst(handlerNode.params);

                if (eventParameter?.type !== AST_NODE_TYPES.Identifier) {
                    return;
                }

                if (
                    hasSenderValidationPattern(
                        handlerNode,
                        context,
                        eventParameter.name
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: handlerNode,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow privileged ipcMain handlers that do not validate sender/frame trust.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-unchecked-ipc-sender",
        },
        messages: {
            default:
                "Validate the IPC sender or sender frame before handling privileged ipcMain requests.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-unchecked-ipc-sender",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
