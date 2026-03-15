import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    isDocumentObject,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            "CallExpression[arguments.length=1][callee.property.name=/^(?:write|writeln)$/]"(
                node: TSESTree.CallExpression
            ) {
                if (node.callee.type !== "MemberExpression") {
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

                context.report({
                    messageId: "default",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow document.write/document.writeln because they bypass safe DOM construction patterns.",
        },
        messages: {
            default:
                "Do not write to the DOM directly using document.write/document.writeln.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-document-write",
});

export default rule;
