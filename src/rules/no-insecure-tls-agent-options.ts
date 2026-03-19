/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            ObjectExpression(node: TSESTree.ObjectExpression) {
                const insecureOptionProperty =
                    findRejectUnauthorizedFalseProperty(node);

                if (insecureOptionProperty === undefined) {
                    return;
                }

                context.report({
                    fix(fixer) {
                        if (
                            insecureOptionProperty.value.type !== "Literal" ||
                            insecureOptionProperty.value.value !== false
                        ) {
                            return null;
                        }

                        return fixer.replaceText(
                            insecureOptionProperty.value,
                            "true"
                        );
                    },
                    messageId: "default",
                    node: insecureOptionProperty,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow rejectUnauthorized: false in TLS/HTTPS option objects.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-insecure-tls-agent-options",
        },
        fixable: "code",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
