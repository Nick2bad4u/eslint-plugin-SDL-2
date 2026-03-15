import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow direct html(...) DOM writes (for example jQuery html()) that bypass sanitization.",
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
