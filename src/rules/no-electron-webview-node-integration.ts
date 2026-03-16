import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const isJsxWebviewElement = (node: TSESTree.JSXOpeningElement): boolean =>
    node.name.type === "JSXIdentifier" &&
    node.name.name.toLowerCase() === "webview";

const getJsxAttributeName = (attributeNode: TSESTree.JSXAttribute): string => {
    if (attributeNode.name.type === "JSXIdentifier") {
        return attributeNode.name.name.toLowerCase();
    }

    return `${attributeNode.name.namespace.name}:${attributeNode.name.name.name}`.toLowerCase();
};

const isNodeIntegrationAttribute = (attributeName: string): boolean => {
    const normalizedName = attributeName.toLowerCase();

    return (
        normalizedName === "nodeintegration" ||
        normalizedName === "nodeintegrationinsubframes"
    );
};

const isTruthyJsxAttributeValue = (
    attributeValue: TSESTree.JSXAttribute["value"]
): boolean => {
    if (attributeValue === null) {
        return true;
    }

    if (attributeValue.type === "Literal") {
        if (typeof attributeValue.value === "boolean") {
            return attributeValue.value;
        }

        if (typeof attributeValue.value === "string") {
            return attributeValue.value.toLowerCase() !== "false";
        }

        return false;
    }

    if (attributeValue.type !== "JSXExpressionContainer") {
        return false;
    }

    if (
        attributeValue.expression.type === "Literal" &&
        typeof attributeValue.expression.value === "boolean"
    ) {
        return attributeValue.expression.value;
    }

    return true;
};

const webPreferencesHasNodeIntegration = (
    attributeValue: TSESTree.JSXAttribute["value"]
): boolean => {
    if (attributeValue === null) {
        return false;
    }

    if (
        attributeValue.type === "Literal" &&
        typeof attributeValue.value === "string"
    ) {
        return /\bnodeintegration\b/iu.test(attributeValue.value);
    }

    return false;
};

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
                if (!isJsxWebviewElement(node)) {
                    return;
                }

                for (const attributeNode of node.attributes) {
                    if (attributeNode.type !== "JSXAttribute") {
                        continue;
                    }

                    const attributeName = getJsxAttributeName(attributeNode);

                    if (isNodeIntegrationAttribute(attributeName)) {
                        if (!isTruthyJsxAttributeValue(attributeNode.value)) {
                            continue;
                        }

                        context.report({
                            messageId: "default",
                            node: attributeNode,
                        });

                        continue;
                    }

                    if (attributeName !== "webpreferences") {
                        continue;
                    }

                    if (
                        !webPreferencesHasNodeIntegration(attributeNode.value)
                    ) {
                        continue;
                    }

                    context.report({
                        messageId: "default",
                        node: attributeNode,
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow node integration flags on Electron webview elements.",
        },
        messages: {
            default:
                "Do not enable node integration options on Electron webview elements.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-webview-node-integration",
});

export default rule;
