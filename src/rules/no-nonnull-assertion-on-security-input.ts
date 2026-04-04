/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow non-null assertions on likely security-sensitive input values.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-nonnull-assertion-on-security-input",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
