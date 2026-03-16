import type { TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    isDocumentObject,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
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
                "disallow document.write/document.writeln because they bypass safe DOM construction patterns.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-write",
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
