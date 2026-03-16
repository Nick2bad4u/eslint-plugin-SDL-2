import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
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
        deprecated: false,
        docs: {
            description:
                "disallow MSApp.execUnsafeLocalFunction which bypasses script-injection safeguards.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-msapp-exec-unsafe",
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
