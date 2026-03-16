import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

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

const isInsecureHttpUrl = (value: string): boolean =>
    /^http:\/\//iu.test(value.trim());

const isTargetRequestMethod = (node: TSESTree.CallExpression): boolean => {
    if (node.callee.type === "Identifier") {
        return node.callee.name === "fetch";
    }

    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    const methodName = getMemberPropertyName(node.callee);

    if (methodName !== "request" && methodName !== "get") {
        return false;
    }

    if (node.callee.object.type !== "Identifier") {
        return false;
    }

    return (
        node.callee.object.name === "http" ||
        node.callee.object.name === "https"
    );
};

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isTargetRequestMethod(node)) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const firstArgumentValue = getStaticStringValue(firstArgument);

                if (
                    typeof firstArgumentValue !== "string" ||
                    !isInsecureHttpUrl(firstArgumentValue)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: firstArgument,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow Node HTTP client calls that use insecure http:// URLs.",
        },
        messages: {
            default: "Use HTTPS endpoints instead of insecure http:// URLs.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-http-request-to-insecure-protocol",
});

export default rule;
