/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
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
                        fix(fixer) {
                            return fixer.remove(attributeNode);
                        },
                        messageId: "default",
                        node: attributeNode,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow enabling allowpopups in Electron webview elements.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-webview-allowpopups",
        },
        fixable: "code",
        messages: {
            default: "Do not enable allowpopups on Electron webview elements.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-webview-allowpopups",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
