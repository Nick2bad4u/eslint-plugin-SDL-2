import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const isJsxWebviewElement = (node: TSESTree.JSXOpeningElement): boolean => {
    if (node.name.type === "JSXIdentifier") {
        return node.name.name.toLowerCase() === "webview";
    }

    return false;
};

const getJsxAttributeName = (
    attributeNode: TSESTree.JSXAttribute
): string | undefined => {
    if (attributeNode.name.type !== "JSXIdentifier") {
        return undefined;
    }

    return attributeNode.name.name.toLowerCase();
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

                    if (getJsxAttributeName(attributeNode) !== "allowpopups") {
                        continue;
                    }

                    if (!isTruthyJsxAttributeValue(attributeNode.value)) {
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
                "Disallow enabling allowpopups in Electron webview elements.",
        },
        messages: {
            default: "Do not enable allowpopups on Electron webview elements.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-webview-allowpopups",
});

export default rule;
