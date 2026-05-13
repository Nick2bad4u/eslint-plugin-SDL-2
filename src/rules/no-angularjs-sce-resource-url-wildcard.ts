import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getMemberPropertyName = (
    memberExpression: TSESTree.MemberExpression
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === AST_NODE_TYPES.Identifier
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === AST_NODE_TYPES.Literal &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return undefined;
};

const isWildcardValue = (value: string): boolean => value.includes("*");

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
                    return;
                }

                if (
                    getMemberPropertyName(node.callee) !==
                    "resourceUrlWhitelist"
                ) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === AST_NODE_TYPES.SpreadElement ||
                    firstArgument.type !== AST_NODE_TYPES.ArrayExpression
                ) {
                    return;
                }

                for (const elementNode of firstArgument.elements) {
                    if (
                        elementNode === null ||
                        elementNode.type === AST_NODE_TYPES.SpreadElement ||
                        elementNode.type !== AST_NODE_TYPES.Literal ||
                        typeof elementNode.value !== "string"
                    ) {
                        continue;
                    }

                    if (!isWildcardValue(elementNode.value)) {
                        continue;
                    }

                    context.report({
                        messageId: "default",
                        node: elementNode,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow wildcard entries in AngularJS SCE resource URL whitelists.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-sce-resource-url-wildcard",
        },
        messages: {
            default:
                "Do not use wildcard resourceUrlWhitelist entries for AngularJS SCE configuration.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angularjs-sce-resource-url-wildcard",
});

export default rule;
