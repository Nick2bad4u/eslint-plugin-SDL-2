import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, isDefined, stringSplit } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getStaticStringValue = (
    node: TSESTree.Expression
): string | undefined => {
    if (
        node.type === AST_NODE_TYPES.Literal &&
        typeof node.value === "string"
    ) {
        return node.value;
    }

    if (
        node.type === AST_NODE_TYPES.TemplateLiteral &&
        node.expressions.length === 0
    ) {
        const firstQuasi = arrayFirst(node.quasis);

        if (
            !isDefined(firstQuasi) ||
            typeof firstQuasi.value.cooked !== "string"
        ) {
            return undefined;
        }

        return firstQuasi.value.cooked;
    }

    return undefined;
};

const isWindowOpenCallee = (
    callee: TSESTree.CallExpression["callee"]
): boolean => {
    if (callee.type !== AST_NODE_TYPES.MemberExpression || callee.computed) {
        return false;
    }

    return (
        callee.object.type === AST_NODE_TYPES.Identifier &&
        callee.object.name === "window" &&
        callee.property.type === AST_NODE_TYPES.Identifier &&
        callee.property.name === "open"
    );
};

const hasNoopenerToken = (features: string): boolean =>
    stringSplit(features.toLowerCase(), ",")
        .map((token) => token.trim())
        .some((token) => token === "noopener" || token.startsWith("noopener="));

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isWindowOpenCallee(node.callee)) {
                    return;
                }

                const [
                    ,
                    secondArgument,
                    thirdArgument,
                ] = node.arguments;

                if (
                    secondArgument === undefined ||
                    secondArgument.type === AST_NODE_TYPES.SpreadElement
                ) {
                    return;
                }

                const targetValue = getStaticStringValue(secondArgument);

                if (targetValue !== "_blank") {
                    return;
                }

                if (
                    thirdArgument === undefined ||
                    thirdArgument.type === AST_NODE_TYPES.SpreadElement
                ) {
                    context.report({
                        messageId: "default",
                        node,
                    });

                    return;
                }

                const featuresValue = getStaticStringValue(thirdArgument);

                if (
                    typeof featuresValue !== "string" ||
                    !hasNoopenerToken(featuresValue)
                ) {
                    context.report({
                        messageId: "default",
                        node: thirdArgument,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "require noopener when using window.open with a _blank target.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-window-open-without-noopener",
        },
        messages: {
            default:
                "Include 'noopener' in window.open features when target is '_blank'.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-window-open-without-noopener",
});

export default rule;
