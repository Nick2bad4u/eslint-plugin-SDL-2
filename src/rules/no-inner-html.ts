/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

const isEmptyStringLiteral = (node: TSESTree.Node): boolean =>
    node.type === "Literal" && node.value === "";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        const mightBeHTMLElement = (node: TSESTree.Node): boolean => {
            const nodeType = getNodeTypeAsString(
                fullTypeChecker,
                node,
                context
            );

            return /HTML.*Element/u.test(nodeType) || nodeType === "any";
        };

        return {
            "AssignmentExpression[left.type='MemberExpression'][left.property.name=/^(?:innerHTML|outerHTML)$/]"(
                node: TSESTree.AssignmentExpression
            ) {
                if (isEmptyStringLiteral(node.right)) {
                    return;
                }

                if (node.left.type !== "MemberExpression") {
                    return;
                }

                if (!mightBeHTMLElement(node.left.object)) {
                    return;
                }

                context.report({
                    messageId: "noInnerHtml",
                    node,
                });
            },
            "CallExpression[arguments.length=2] > MemberExpression.callee[property.name='insertAdjacentHTML']"(
                node: TSESTree.MemberExpression
            ) {
                if (node.parent.type !== "CallExpression") {
                    return;
                }

                const secondArgument = node.parent.arguments[1];

                if (
                    secondArgument !== undefined &&
                    isEmptyStringLiteral(secondArgument)
                ) {
                    return;
                }

                if (!mightBeHTMLElement(node.object)) {
                    return;
                }

                context.report({
                    messageId: "noInsertAdjacentHTML",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow unsafe direct DOM HTML writes via innerHTML/outerHTML/insertAdjacentHTML.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-inner-html",
        },
        messages: {
            noInnerHtml:
                "Do not write to the DOM directly using innerHTML/outerHTML.",
            noInsertAdjacentHTML:
                "Do not write to the DOM using insertAdjacentHTML.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-inner-html",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
