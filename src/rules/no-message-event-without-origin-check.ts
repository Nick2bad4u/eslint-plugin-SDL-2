/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { UnknownRecord } from "type-fest";

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
    expression.type === "ArrowFunctionExpression" ||
    expression.type === "FunctionExpression";

const hasMessageEventGuardKeywords = (callbackText: string): boolean =>
    /\b(?:allowlist|origin|trusted|validate|verify|whitelist)\b/iu.test(
        callbackText
    );

const toNode = (value: unknown): Readonly<TSESTree.Node> | undefined => {
    if (typeof value !== "object" || value === null) {
        return undefined;
    }

    const recordValue = value as UnknownRecord;

    if (
        !keyIn(recordValue, "type") ||
        typeof recordValue["type"] !== "string"
    ) {
        return undefined;
    }

    return recordValue as unknown as Readonly<TSESTree.Node>;
};

const someDescendantNode = (
    node: Readonly<TSESTree.Node>,
    predicate: (node: Readonly<TSESTree.Node>) => boolean
): boolean => {
    if (predicate(node)) {
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
                    someDescendantNode(childNode, predicate)
                ) {
                    return true;
                }
            }

            continue;
        }

        const childNode = toNode(propertyValue);

        if (
            childNode !== undefined &&
            someDescendantNode(childNode, predicate)
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
    node.type === "Identifier" && node.name === identifierName;

const isStaticPropertyMatch = (
    memberExpression: Readonly<TSESTree.MemberExpression>,
    objectName: string,
    propertyName: string
): boolean =>
    isIdentifierNamed(memberExpression.object, objectName) &&
    getMemberPropertyName(memberExpression) === propertyName;

const patternContainsProperty = (
    pattern: Readonly<TSESTree.ObjectPattern>,
    propertyName: string
): boolean =>
    pattern.properties.some((propertyNode) => {
        if (propertyNode.type !== "Property") {
            return false;
        }

        return getPropertyName(propertyNode) === propertyName;
    });

const containsObjectDestructureFromIdentifier = (
    rootNode: Readonly<TSESTree.Node>,
    sourceName: string,
    propertyName: string
): boolean =>
    someDescendantNode(rootNode, (node) => {
        if (node.type === "VariableDeclarator") {
            return (
                node.id.type === "ObjectPattern" &&
                node.init !== null &&
                isIdentifierNamed(node.init, sourceName) &&
                patternContainsProperty(node.id, propertyName)
            );
        }

        if (node.type !== "AssignmentExpression") {
            return false;
        }

        return (
            node.left.type === "ObjectPattern" &&
            isIdentifierNamed(node.right, sourceName) &&
            patternContainsProperty(node.left, propertyName)
        );
    });

const containsMemberPropertyAccess = (
    rootNode: Readonly<TSESTree.Node>,
    objectName: string,
    propertyName: string
): boolean =>
    someDescendantNode(rootNode, (node) =>
        node.type === "MemberExpression"
            ? isStaticPropertyMatch(node, objectName, propertyName)
            : false
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
    eventParameterName: string
): boolean =>
    containsMemberPropertyAccess(
        callbackNode.body,
        eventParameterName,
        "data"
    ) ||
    containsObjectDestructureFromIdentifier(
        callbackNode.body,
        eventParameterName,
        "data"
    );

const callbackHasOriginValidation = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameterName: string
): boolean => {
    const callbackSourceText = context.sourceCode.getText(callbackNode);

    return (
        containsMemberPropertyAccess(
            callbackNode.body,
            eventParameterName,
            "origin"
        ) ||
        containsObjectDestructureFromIdentifier(
            callbackNode.body,
            eventParameterName,
            "origin"
        ) ||
        hasMessageEventGuardKeywords(callbackSourceText)
    );
};

const reportsIdentifierCallback = (
    callbackNode: CallbackFunction,
    context: RuleContext,
    eventParameter: TSESTree.Identifier
): boolean =>
    callbackUsesMessageData(callbackNode, eventParameter.name) &&
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
                    secondArgument.type === "SpreadElement"
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
