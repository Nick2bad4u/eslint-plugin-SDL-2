import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

const isSanitizedExpression = (node: TSESTree.Expression): boolean => {
    if (node.type !== "CallExpression") {
        return false;
    }

    if (node.callee.type === "Identifier") {
        return /createhtml|sanitize|trusted/u.test(
            node.callee.name.toLowerCase()
        );
    }

    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    const propertyName = getMemberPropertyName(node.callee);

    return (
        typeof propertyName === "string" &&
        /createhtml|sanitize|trusted/u.test(propertyName.toLowerCase())
    );
};

const isCreateContextualFragmentCall = (
    node: TSESTree.CallExpression
): boolean => {
    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    return getMemberPropertyName(node.callee) === "createContextualFragment";
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isCreateContextualFragmentCall(node)) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement" ||
                    getStaticStringValue(firstArgument) === "" ||
                    isSanitizedExpression(firstArgument)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: firstArgument,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Range.createContextualFragment(...) calls on unsanitized HTML input.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-range-create-contextual-fragment",
        },
        messages: {
            default:
                "Sanitize HTML before passing it to Range.createContextualFragment().",
        },
        schema: [],
        type: "problem",
    },
    name: "no-range-create-contextual-fragment",
});

export default rule;
