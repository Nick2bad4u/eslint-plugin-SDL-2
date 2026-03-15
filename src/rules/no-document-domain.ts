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
            "AssignmentExpression[operator='='][left.property.name='domain']"(
                node: TSESTree.AssignmentExpression
            ) {
                if (node.left.type !== "MemberExpression") {
                    return;
                }

                if (
                    !isDocumentObject(
                        node.left.object,
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
                "Disallow writes to document.domain that can weaken same-origin policy guarantees.",
        },
        messages: {
            default: "Do not write to document.domain.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-document-domain",
});

export default rule;
