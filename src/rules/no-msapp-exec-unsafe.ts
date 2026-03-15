import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        return {
            "CallExpression[arguments.length=1][callee.object.name='MSApp'][callee.property.name='execUnsafeLocalFunction']"(
                node
            ) {
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
                "Disallow MSApp.execUnsafeLocalFunction which bypasses script-injection safeguards.",
        },
        messages: {
            default: "Do not bypass script injection validation.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-msapp-exec-unsafe",
});

export default rule;
