/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getMemberPropertyName = (
    memberExpression: TSESTree.MemberExpression
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === "Identifier"
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === "Literal" &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return undefined;
};

const getStaticStringValue = (
    node: TSESTree.Expression
): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
        return arrayFirst(node.quasis)?.value.cooked ?? undefined;
    }

    return undefined;
};

const isJavaScriptUrl = (value: string): boolean =>
    /^\s*javascript\s*:/iu.test(value);

const isLocationLikeLeftHand = (
    expression: TSESTree.AssignmentExpression["left"]
): boolean => {
    if (expression.type !== "MemberExpression") {
        return false;
    }

    const propertyName = getMemberPropertyName(expression);

    return propertyName === "location" || propertyName === "href";
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (node.operator !== "=") {
                    return;
                }

                if (!isLocationLikeLeftHand(node.left)) {
                    return;
                }

                const assignedValue = getStaticStringValue(node.right);

                if (
                    typeof assignedValue !== "string" ||
                    !isJavaScriptUrl(assignedValue)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                const methodName = getMemberPropertyName(node.callee);

                if (
                    methodName !== "assign" &&
                    methodName !== "replace" &&
                    methodName !== "open"
                ) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const argumentValue = getStaticStringValue(firstArgument);

                if (
                    typeof argumentValue !== "string" ||
                    !isJavaScriptUrl(argumentValue)
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
                "disallow assigning javascript: URLs to location-like navigation sinks.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-location-javascript-url",
        },
        messages: {
            default:
                "Do not use javascript: URLs in location or open-like navigation sinks.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-location-javascript-url",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
