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

const getStaticStringValue = (
    node: TSESTree.Expression
): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
        return arrayFirst(node.quasis)?.value.cooked ?? undefined;
    }

    return undefined;
};

const isAllowedOriginLiteral = (origin: string): boolean => {
    const normalizedOrigin = origin.trim();

    if (normalizedOrigin === "") {
        return false;
    }

    if (normalizedOrigin.includes("*")) {
        return false;
    }

    return /^https?:\/\//iu.test(normalizedOrigin);
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                if (getMemberPropertyName(node.callee) !== "postMessage") {
                    return;
                }

                const [, secondArgument] = node.arguments;

                if (
                    secondArgument === undefined ||
                    secondArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const secondArgumentValue =
                    getStaticStringValue(secondArgument);

                if (
                    typeof secondArgumentValue === "string" &&
                    isAllowedOriginLiteral(secondArgumentValue)
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
                "require explicit, allowlisted postMessage target origins instead of wildcard/dynamic values.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-postmessage-without-origin-allowlist",
        },
        messages: {
            default:
                "Use a strict, explicit allowlisted origin for postMessage targetOrigin.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-postmessage-without-origin-allowlist",
});

export default rule;
