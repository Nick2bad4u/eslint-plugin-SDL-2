import type { TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    isDocumentObject,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], "doNotUseCookies">({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            "MemberExpression[property.name='cookie']"(
                node: TSESTree.MemberExpression
            ) {
                if (!isDocumentObject(node.object, context, fullTypeChecker)) {
                    return;
                }

                context.report({
                    messageId: "doNotUseCookies",
                    node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow document.cookie usage to avoid insecure legacy client-side storage patterns.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-cookies",
        },
        messages: {
            doNotUseCookies: "Do not use HTTP cookies in modern applications.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-cookies",
});

export default rule;
