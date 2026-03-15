import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

const isEmptyStringLiteral = (node: TSESTree.Node): boolean =>
    node.type === "Literal" && node.value === "";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
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
                "Disallow unsafe direct DOM HTML writes via innerHTML/outerHTML/insertAdjacentHTML.",
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
