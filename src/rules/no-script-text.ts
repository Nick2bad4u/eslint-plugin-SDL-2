/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { getFullTypeChecker } from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";
import { isLikelyScriptElement } from "../_internal/script-element.js";

type MessageIds = "default";

const isScriptTextPropertyName = (propertyName: string | undefined): boolean =>
    propertyName === "innerText" ||
    propertyName === "text" ||
    propertyName === "textContent";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (node.left.type !== "MemberExpression") {
                    return;
                }

                if (
                    !isScriptTextPropertyName(getMemberPropertyName(node.left))
                ) {
                    return;
                }

                if (getStaticStringValue(node.right) === "") {
                    return;
                }

                if (
                    !isLikelyScriptElement(
                        node.left.object,
                        context,
                        fullTypeChecker
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: node.right,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow assigning executable code through HTMLScriptElement text, textContent, or innerText sinks.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-script-text",
        },
        messages: {
            default:
                "Do not inject executable code through script text sinks; load a reviewed script resource or module instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-script-text",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
