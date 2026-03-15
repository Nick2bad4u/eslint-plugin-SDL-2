import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            "CallExpression[arguments.length>=2][arguments.length<=3][callee.property.name='postMessage']"(
                node: TSESTree.CallExpression
            ) {
                const [, targetOrigin] = node.arguments;

                if (
                    targetOrigin?.type !== "Literal" ||
                    targetOrigin.value !== "*"
                ) {
                    return;
                }

                if (
                    fullTypeChecker !== undefined &&
                    node.callee.type === "MemberExpression"
                ) {
                    const calleeObjectType = getNodeTypeAsString(
                        fullTypeChecker,
                        node.callee.object,
                        context
                    );

                    if (!["any", "Window"].includes(calleeObjectType)) {
                        return;
                    }
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
                "Disallow '*' targetOrigin in postMessage calls to prevent cross-origin data leakage.",
        },
        messages: {
            default:
                "Do not use '*' as targetOrigin when sending data with postMessage.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-postmessage-star-origin",
});

export default rule;
