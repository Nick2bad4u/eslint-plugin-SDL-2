import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

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

const isWildcardValue = (value: string): boolean => value.includes("*");

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
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
                    firstArgument.type === "SpreadElement" ||
                    firstArgument.type !== "ArrayExpression"
                ) {
                    return;
                }

                for (const elementNode of firstArgument.elements) {
                    if (
                        elementNode === null ||
                        elementNode.type === "SpreadElement" ||
                        elementNode.type !== "Literal" ||
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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow wildcard entries in AngularJS SCE resource URL whitelists.",
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
