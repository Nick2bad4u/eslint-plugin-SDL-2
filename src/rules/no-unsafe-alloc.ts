 
import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
    create(context) {
        return {
            "MemberExpression[object.name='Buffer'][property.name=/^(?:allocUnsafe|allocUnsafeSlow)$/]"(
                node: TSESTree.MemberExpression
            ) {
                const parentNode = node.parent;

                if (
                    parentNode?.type === "CallExpression" &&
                    parentNode.arguments.length === 1
                ) {
                    const [firstArgument] = parentNode.arguments;

                    if (
                        firstArgument?.type === "Literal" &&
                        (firstArgument.value === 0 ||
                            firstArgument.value === "0")
                    ) {
                        return;
                    }
                }

                context.report({
                    fix(fixer) {
                        if (
                            node.computed ||
                            node.property.type !== "Identifier"
                        ) {
                            return null;
                        }

                        return fixer.replaceText(node.property, "alloc");
                    },
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
                "disallow Buffer.allocUnsafe/allocUnsafeSlow allocations that may expose uninitialized memory.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-unsafe-alloc",
        },
        fixable: "code",
        messages: {
            default: "Do not allocate uninitialized buffers in Node.js.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-unsafe-alloc",
});

export default rule;
 
