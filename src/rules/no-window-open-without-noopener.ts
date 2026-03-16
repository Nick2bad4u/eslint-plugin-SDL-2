/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst, isDefined, stringSplit } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getStaticStringValue = (
    node: TSESTree.Expression
): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
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
    stringSplit(features.toLowerCase(), ",")
        .map((token) => token.trim())
        .some((token) => token === "noopener" || token.startsWith("noopener="));

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
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
        deprecated: false,
        docs: {
            description:
                "require noopener when using window.open with a _blank target.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-window-open-without-noopener",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
