import type { TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    isDocumentObject,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

const isInsertHtmlCommand = (expression: TSESTree.Expression): boolean =>
    getStaticStringValue(expression)?.toLowerCase() === "inserthtml";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                if (getMemberPropertyName(node.callee) !== "execCommand") {
                    return;
                }

                if (
                    !isDocumentObject(
                        node.callee.object,
                        context,
                        fullTypeChecker
                    )
                ) {
                    return;
                }

                const [
                    firstArgument,
                    ,
                    thirdArgument,
                ] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement" ||
                    !isInsertHtmlCommand(firstArgument)
                ) {
                    return;
                }

                if (
                    thirdArgument === undefined ||
                    thirdArgument.type === "SpreadElement" ||
                    getStaticStringValue(thirdArgument) === ""
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: thirdArgument,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow document.execCommand('insertHTML', ...) HTML insertion sinks.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-document-execcommand-insert-html",
        },
        messages: {
            default:
                "Do not inject HTML with document.execCommand('insertHTML', ...); build DOM nodes safely or use text-only insertion APIs instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-document-execcommand-insert-html",
});

export default rule;
