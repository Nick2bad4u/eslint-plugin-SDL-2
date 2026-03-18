import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

const isSetHtmlUnsafeCall = (node: TSESTree.CallExpression): boolean => {
    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    return getMemberPropertyName(node.callee) === "setHTMLUnsafe";
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isSetHtmlUnsafeCall(node)) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument !== undefined &&
                    firstArgument.type !== "SpreadElement" &&
                    getStaticStringValue(firstArgument) === ""
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
        deprecated: false,
        docs: {
            description:
                "disallow setHTMLUnsafe() calls that bypass the safer HTML Sanitizer API path.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-set-html-unsafe",
        },
        messages: {
            default:
                "Do not call setHTMLUnsafe(); use setHTML() or build DOM nodes safely instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-set-html-unsafe",
});

export default rule;
