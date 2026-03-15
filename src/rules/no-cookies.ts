import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    isDocumentObject,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow document.cookie usage to avoid insecure legacy client-side storage patterns.",
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
