/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
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
        deprecated: false,
        docs: {
            description:
                "disallow wildcard entries in AngularJS SCE resource URL whitelists.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-sce-resource-url-wildcard",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
