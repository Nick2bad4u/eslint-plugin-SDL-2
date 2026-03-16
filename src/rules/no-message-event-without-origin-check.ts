/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";

type CallbackFunction =
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression;

type MessageIds = "default";
type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, unknown[]>>;

const isFunctionExpression = (
    expression: TSESTree.Expression
): expression is CallbackFunction =>
    expression.type === "ArrowFunctionExpression" ||
    expression.type === "FunctionExpression";

const escapeRegex = (value: string): string =>
    value.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`);

const hasMessageEventGuardKeywords = (callbackText: string): boolean =>
    /\b(?:allowlist|origin|trusted|validate|verify|whitelist)\b/iu.test(
        callbackText
    );

const hasObjectPatternProperty = (
    objectPattern: TSESTree.ObjectPattern,
    propertyName: string
): boolean =>
    objectPattern.properties.some((propertyNode) => {
        if (propertyNode.type !== "Property") {
            return false;
        }

        return getPropertyName(propertyNode) === propertyName;
    });

const callbackUsesMessageData = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);
    const escapedEventName = escapeRegex(eventParameterName);
    const eventDataPattern = new RegExp(
        String.raw`\b${escapedEventName}\s*\.\s*data\b`,
        "u"
    );
    const dataDestructurePattern = new RegExp(
        String.raw`\{[^}]*\bdata\b[^}]*\}\s*=\s*${escapedEventName}\b`,
        "u"
    );

    return (
        eventDataPattern.test(callbackSourceText) ||
        dataDestructurePattern.test(callbackSourceText)
    );
};

const callbackHasOriginValidation = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);
    const escapedEventName = escapeRegex(eventParameterName);
    const eventOriginPattern = new RegExp(
        String.raw`\b${escapedEventName}\s*\.\s*origin\b`,
        "u"
    );
    const originDestructurePattern = new RegExp(
        String.raw`\{[^}]*\borigin\b[^}]*\}\s*=\s*${escapedEventName}\b`,
        "u"
    );

    return (
        eventOriginPattern.test(callbackSourceText) ||
        originDestructurePattern.test(callbackSourceText) ||
        hasMessageEventGuardKeywords(callbackSourceText)
    );
};

const reportsIdentifierCallback = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameter: TSESTree.Identifier
): boolean =>
    callbackUsesMessageData(callbackNode, context, eventParameter.name) &&
    !callbackHasOriginValidation(callbackNode, context, eventParameter.name);

const reportsObjectPatternCallback = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameter: TSESTree.ObjectPattern
): boolean => {
    if (!hasObjectPatternProperty(eventParameter, "data")) {
        return false;
    }

    if (hasObjectPatternProperty(eventParameter, "origin")) {
        return false;
    }

    return !hasMessageEventGuardKeywords(
        context.sourceCode.getText(callbackNode)
    );
};

const shouldReportMessageEventCallback = (
    callbackNode: CallbackFunction,
    context: RuleContext
): boolean => {
    const [firstParameter] = callbackNode.params;

    if (firstParameter === undefined || firstParameter.type === "RestElement") {
        return false;
    }

    if (firstParameter.type === "Identifier") {
        return reportsIdentifierCallback(callbackNode, context, firstParameter);
    }

    if (firstParameter.type === "ObjectPattern") {
        return reportsObjectPatternCallback(
            callbackNode,
            context,
            firstParameter
        );
    }

    return false;
};

const isMessageEventListenerCall = (node: TSESTree.CallExpression): boolean => {
    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "addEventListener") {
        return false;
    }

    const [firstArgument] = node.arguments;

    return (
        firstArgument !== undefined &&
        firstArgument.type !== "SpreadElement" &&
        getStaticStringValue(firstArgument) === "message"
    );
};

const isOnMessageAssignment = (node: TSESTree.AssignmentExpression): boolean =>
    node.operator === "=" &&
    node.left.type === "MemberExpression" &&
    getMemberPropertyName(node.left) === "onmessage";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (
                    !isOnMessageAssignment(node) ||
                    !isFunctionExpression(node.right) ||
                    !shouldReportMessageEventCallback(node.right, context)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: node.right,
                });
            },
            CallExpression(node: TSESTree.CallExpression) {
                if (!isMessageEventListenerCall(node)) {
                    return;
                }

                const [, secondArgument] = node.arguments;

                if (
                    secondArgument === undefined ||
                    secondArgument.type === "SpreadElement" ||
                    !isFunctionExpression(secondArgument) ||
                    !shouldReportMessageEventCallback(secondArgument, context)
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
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow MessageEvent handlers that consume event data without validating event.origin.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-message-event-without-origin-check",
        },
        messages: {
            default:
                "Validate MessageEvent.origin before consuming data from received message events.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-message-event-without-origin-check",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
