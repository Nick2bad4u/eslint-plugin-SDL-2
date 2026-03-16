/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getMemberPropertyName = (
    memberExpression: TSESTree.MemberExpression
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === "Identifier"
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === "Literal" &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return undefined;
};

const isProcessEnvAccess = (node: TSESTree.Expression): boolean => {
    if (node.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(node) !== "env") {
        return false;
    }

    return node.object.type === "Identifier" && node.object.name === "process";
};

const isTlsRejectUnauthorizedMember = (
    node: TSESTree.AssignmentExpression["left"]
): boolean => {
    if (node.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(node) !== "NODE_TLS_REJECT_UNAUTHORIZED") {
        return false;
    }

    return isProcessEnvAccess(node.object);
};

const isUnsafeOverrideValue = (node: TSESTree.Expression): boolean => {
    if (node.type === "Literal") {
        return node.value === 0 || node.value === "0";
    }

    return (
        node.type === "TemplateLiteral" &&
        node.expressions.length === 0 &&
        arrayFirst(node.quasis)?.value.cooked === "0"
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (node.operator !== "=") {
                    return;
                }

                if (!isTlsRejectUnauthorizedMember(node.left)) {
                    return;
                }

                if (!isUnsafeOverrideValue(node.right)) {
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
        deprecated: false,
        docs: {
            description:
                "disallow process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' overrides in Node.js runtime code.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-node-tls-reject-unauthorized-zero",
        },
        messages: {
            default:
                "Do not disable TLS certificate validation with NODE_TLS_REJECT_UNAUTHORIZED=0.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-node-tls-reject-unauthorized-zero",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
