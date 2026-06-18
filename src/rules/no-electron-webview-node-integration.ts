/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const isJsxWebviewElement = (node: TSESTree.JSXOpeningElement): boolean =>
    node.name.type === AST_NODE_TYPES.JSXIdentifier &&
    node.name.name.toLowerCase() === "webview";

const getJsxAttributeName = (attributeNode: TSESTree.JSXAttribute): string => {
    if (attributeNode.name.type === AST_NODE_TYPES.JSXIdentifier) {
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

    if (attributeValue.type === AST_NODE_TYPES.Literal) {
        if (typeof attributeValue.value === "boolean") {
            return attributeValue.value;
        }

        if (typeof attributeValue.value === "string") {
            return attributeValue.value.toLowerCase() !== "false";
        }

        return false;
    }

    if (attributeValue.type !== AST_NODE_TYPES.JSXExpressionContainer) {
        return false;
    }

    if (
        attributeValue.expression.type === AST_NODE_TYPES.Literal &&
        typeof attributeValue.expression.value === "boolean"
    ) {
        return attributeValue.expression.value;
    }

    return true;
};

const hasNodeIntegrationWebPreference = (
    attributeValue: TSESTree.JSXAttribute["value"]
): boolean => {
    if (attributeValue === null) {
        return false;
    }

    if (
        attributeValue.type === AST_NODE_TYPES.Literal &&
        typeof attributeValue.value === "string"
    ) {
        return /\bnodeintegration\b/iv.test(attributeValue.value);
    }

    return false;
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create: (context) => ({
        JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
            if (!isJsxWebviewElement(node)) {
                return;
            }

            for (const attributeNode of node.attributes) {
                if (attributeNode.type !== AST_NODE_TYPES.JSXAttribute) {
                    continue;
                }

                const attributeName = getJsxAttributeName(attributeNode);

                if (isNodeIntegrationAttribute(attributeName)) {
                    if (!isTruthyJsxAttributeValue(attributeNode.value)) {
                        continue;
                    }

                    context.report({
                        fix: (fixer) => fixer.remove(attributeNode),
                        messageId: "default",
                        node: attributeNode,
                    });

                    continue;
                }

                if (attributeName !== "webpreferences") {
                    continue;
                }

                if (!hasNodeIntegrationWebPreference(attributeNode.value)) {
                    continue;
                }

                context.report({
                    messageId: "default",
                    node: attributeNode,
                });
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow node integration flags on Electron webview elements.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-webview-node-integration",
        },
        fixable: "code",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
