/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { UnknownRecord } from "type-fest";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { keyIn, objectEntries } from "ts-extras";

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
    expression: Readonly<TSESTree.Node>
): expression is CallbackFunction =>
    expression.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    expression.type === AST_NODE_TYPES.FunctionExpression;

const hasMessageEventGuardKeywords = (callbackText: string): boolean =>
    /\b(?:allowlist|origin|trusted|validate|verify|whitelist)\b/iv.test(
        callbackText
    );

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const isNodeLike = (value: unknown): value is Readonly<TSESTree.Node> =>
    isUnknownRecord(value) &&
    keyIn(value, "type") &&
    typeof value["type"] === "string";

const toNode = (value: unknown): Readonly<TSESTree.Node> | undefined =>
    isNodeLike(value) ? value : undefined;

const hasDescendantNode = (
    node: Readonly<TSESTree.Node>,
    hasMatchingNode: (node: Readonly<TSESTree.Node>) => boolean
): boolean => {
    if (hasMatchingNode(node)) {
        return true;
    }

    for (const [propertyName, propertyValue] of objectEntries(node)) {
        if (propertyName === "parent") {
            continue;
        }

        if (Array.isArray(propertyValue)) {
            for (const element of propertyValue) {
                const childNode = toNode(element);

                if (
                    childNode !== undefined &&
                    hasDescendantNode(childNode, hasMatchingNode)
                ) {
                    return true;
                }
            }

            continue;
        }

        const childNode = toNode(propertyValue);

        if (
            childNode !== undefined &&
            hasDescendantNode(childNode, hasMatchingNode)
        ) {
            return true;
        }
    }

    return false;
};

const isIdentifierNamed = (
    node: Readonly<TSESTree.Node>,
    identifierName: string
): node is TSESTree.Identifier =>
    node.type === AST_NODE_TYPES.Identifier && node.name === identifierName;

const isStaticPropertyMatch = (
    memberExpression: Readonly<TSESTree.MemberExpression>,
    objectName: string,
    propertyName: string
): boolean =>
    isIdentifierNamed(memberExpression.object, objectName) &&
    getMemberPropertyName(memberExpression) === propertyName;

const hasPatternProperty = (
    pattern: Readonly<TSESTree.ObjectPattern>,
    propertyName: string
): boolean =>
    pattern.properties.some((propertyNode) => {
        if (propertyNode.type !== AST_NODE_TYPES.Property) {
            return false;
        }

        return getPropertyName(propertyNode) === propertyName;
    });

const hasObjectDestructureFromIdentifier = (
    rootNode: Readonly<TSESTree.Node>,
    sourceName: string,
    propertyName: string
): boolean =>
    hasDescendantNode(rootNode, (node) => {
        if (node.type === AST_NODE_TYPES.VariableDeclarator) {
            return (
                node.id.type === AST_NODE_TYPES.ObjectPattern &&
                node.init !== null &&
                isIdentifierNamed(node.init, sourceName) &&
                hasPatternProperty(node.id, propertyName)
            );
        }

        if (node.type !== AST_NODE_TYPES.AssignmentExpression) {
            return false;
        }

        return (
            node.left.type === AST_NODE_TYPES.ObjectPattern &&
            isIdentifierNamed(node.right, sourceName) &&
            hasPatternProperty(node.left, propertyName)
        );
    });

const hasMemberPropertyAccess = (
    rootNode: Readonly<TSESTree.Node>,
    objectName: string,
    propertyName: string
): boolean =>
    hasDescendantNode(rootNode, (node) =>
        node.type === AST_NODE_TYPES.MemberExpression
            ? isStaticPropertyMatch(node, objectName, propertyName)
            : false
    );

const hasObjectPatternProperty = (
    objectPattern: TSESTree.ObjectPattern,
    propertyName: string
): boolean =>
    objectPattern.properties.some((propertyNode) => {
        if (propertyNode.type !== AST_NODE_TYPES.Property) {
            return false;
        }

        return getPropertyName(propertyNode) === propertyName;
    });

const hasCallbackMessageDataUsage = (
    callbackNode: CallbackFunction,
    eventParameterName: string
): boolean =>
    hasMemberPropertyAccess(callbackNode.body, eventParameterName, "data") ||
    hasObjectDestructureFromIdentifier(
        callbackNode.body,
        eventParameterName,
        "data"
    );

const hasCallbackOriginValidation = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);

    return (
        hasMemberPropertyAccess(
            callbackNode.body,
            eventParameterName,
            "origin"
        ) ||
        hasObjectDestructureFromIdentifier(
            callbackNode.body,
            eventParameterName,
            "origin"
        ) ||
        hasMessageEventGuardKeywords(callbackSourceText)
    );
};

const shouldReportIdentifierCallback = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameter: TSESTree.Identifier
): boolean =>
    hasCallbackMessageDataUsage(callbackNode, eventParameter.name) &&
    !hasCallbackOriginValidation(callbackNode, context, eventParameter.name);

const shouldReportObjectPatternCallback = (
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

    if (
        firstParameter === undefined ||
        firstParameter.type === AST_NODE_TYPES.RestElement
    ) {
        return false;
    }

    if (firstParameter.type === AST_NODE_TYPES.Identifier) {
        return shouldReportIdentifierCallback(
            callbackNode,
            context,
            firstParameter
        );
    }

    if (firstParameter.type === AST_NODE_TYPES.ObjectPattern) {
        return shouldReportObjectPatternCallback(
            callbackNode,
            context,
            firstParameter
        );
    }

    return false;
};

const isMessageEventListenerCall = (node: TSESTree.CallExpression): boolean => {
    if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "addEventListener") {
        return false;
    }

    const [firstArgument] = node.arguments;

    return (
        firstArgument !== undefined &&
        firstArgument.type !== AST_NODE_TYPES.SpreadElement &&
        getStaticStringValue(firstArgument) === "message"
    );
};

const isOnMessageAssignment = (node: TSESTree.AssignmentExpression): boolean =>
    node.operator === "=" &&
    node.left.type === AST_NODE_TYPES.MemberExpression &&
    getMemberPropertyName(node.left) === "onmessage";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (!isOnMessageAssignment(node)) {
                    return;
                }

                if (!isFunctionExpression(node.right)) {
                    return;
                }

                if (!shouldReportMessageEventCallback(node.right, context)) {
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
                    secondArgument.type === AST_NODE_TYPES.SpreadElement
                ) {
                    return;
                }

                if (!isFunctionExpression(secondArgument)) {
                    return;
                }

                if (
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow MessageEvent handlers that consume event data without validating event.origin.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-message-event-without-origin-check",
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
