import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
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
                "Disallow Buffer.allocUnsafe/allocUnsafeSlow allocations that may expose uninitialized memory.",
        },
        messages: {
            default: "Do not allocate uninitialized buffers in Node.js.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-unsafe-alloc",
});

export default rule;
