import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
    create(context) {
        return {
            "CallExpression[arguments.length=1] > MemberExpression.callee[property.name='html']"(
                node: TSESTree.MemberExpression
            ) {
                const parentCall = node.parent;

                if (parentCall.type !== "CallExpression") {
                    return;
                }

                const [firstArgument] = parentCall.arguments;

                if (
                    firstArgument?.type === "Literal" &&
                    (firstArgument.value === "" || firstArgument.value === null)
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow direct html(...) DOM writes (for example jQuery html()) that bypass sanitization.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-html-method",
        },
        messages: {
            default: "Do not write to the DOM directly using html(...).",
        },
        schema: [],
        type: "problem",
    },
    name: "no-html-method",
});

export default rule;
