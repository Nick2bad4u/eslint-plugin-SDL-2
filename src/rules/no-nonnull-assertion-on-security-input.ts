import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const SECURITY_INPUT_PATTERN = /html|input|message|origin|payload|token|url/iu;

const isSecuritySensitiveExpression = (
    expression: TSESTree.Expression
): boolean => {
    if (expression.type === "Identifier") {
        return SECURITY_INPUT_PATTERN.test(expression.name);
    }

    if (
        expression.type === "MemberExpression" &&
        !expression.computed &&
        expression.property.type === "Identifier"
    ) {
        return SECURITY_INPUT_PATTERN.test(expression.property.name);
    }

    return false;
};

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            TSNonNullExpression(node: TSESTree.TSNonNullExpression) {
                if (!isSecuritySensitiveExpression(node.expression)) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow non-null assertions on likely security-sensitive input values.",
        },
        messages: {
            default:
                "Avoid non-null assertions on security-sensitive inputs; validate before use.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-nonnull-assertion-on-security-input",
});

export default rule;
