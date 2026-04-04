/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    isDocumentObject,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], "default">({
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow writes to document.domain that can weaken same-origin policy guarantees.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-document-domain",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
