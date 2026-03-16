import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

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

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                if (
                    getMemberPropertyName(node.callee) !==
                    "bypassSecurityTrustHtml"
                ) {
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
                "Disallow Angular bypassSecurityTrustHtml usage in application code.",
        },
        messages: {
            default:
                "Avoid bypassSecurityTrustHtml; use validated/sanitized HTML flows instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angular-bypass-security-trust-html",
});

export default rule;
