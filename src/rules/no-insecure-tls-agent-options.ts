import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const isFalseLiteral = (node: TSESTree.Property["value"]): boolean =>
    node.type === "Literal" && node.value === false;

const getObjectPropertyName = (
    propertyNode: TSESTree.Property
): string | undefined => {
    if (propertyNode.computed) {
        return undefined;
    }

    if (propertyNode.key.type === "Identifier") {
        return propertyNode.key.name;
    }

    if (
        propertyNode.key.type === "Literal" &&
        typeof propertyNode.key.value === "string"
    ) {
        return propertyNode.key.value;
    }

    return undefined;
};

const findRejectUnauthorizedFalseProperty = (
    objectExpression: TSESTree.ObjectExpression
): TSESTree.Property | undefined => {
    for (const propertyNode of objectExpression.properties) {
        if (propertyNode.type !== "Property" || propertyNode.kind !== "init") {
            continue;
        }

        if (getObjectPropertyName(propertyNode) !== "rejectUnauthorized") {
            continue;
        }

        if (isFalseLiteral(propertyNode.value)) {
            return propertyNode;
        }
    }

    return undefined;
};

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            ObjectExpression(node: TSESTree.ObjectExpression) {
                const insecureOptionProperty =
                    findRejectUnauthorizedFalseProperty(node);

                if (insecureOptionProperty === undefined) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: insecureOptionProperty,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow rejectUnauthorized: false in TLS/HTTPS option objects.",
        },
        messages: {
            default:
                "Do not disable TLS certificate verification with rejectUnauthorized: false.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-insecure-tls-agent-options",
});

export default rule;
