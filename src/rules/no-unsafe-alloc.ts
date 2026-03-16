/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
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
                "disallow Buffer.allocUnsafe/allocUnsafeSlow allocations that may expose uninitialized memory.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-unsafe-alloc",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
