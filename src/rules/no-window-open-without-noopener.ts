import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getStaticStringValue = (
    node: TSESTree.Expression
): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (
        node.type === "TemplateLiteral" &&
        node.expressions.length === 0 &&
        typeof node.quasis[0]?.value.cooked === "string"
    ) {
        return node.quasis[0].value.cooked;
    }

    return undefined;
};

const isWindowOpenCallee = (
    callee: TSESTree.CallExpression["callee"]
): boolean => {
    if (callee.type !== "MemberExpression" || callee.computed) {
        return false;
    }

    return (
        callee.object.type === "Identifier" &&
        callee.object.name === "window" &&
        callee.property.type === "Identifier" &&
        callee.property.name === "open"
    );
};

const hasNoopenerToken = (features: string): boolean =>
    features
        .toLowerCase()
        .split(",")
        .map((token) => token.trim())
        .some((token) => token === "noopener" || token.startsWith("noopener="));

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
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
                    secondArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const targetValue = getStaticStringValue(secondArgument);

                if (targetValue !== "_blank") {
                    return;
                }

                if (
                    thirdArgument === undefined ||
                    thirdArgument.type === "SpreadElement"
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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Require noopener when using window.open with a _blank target.",
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
