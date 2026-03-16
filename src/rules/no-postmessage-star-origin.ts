import type { TSESTree } from "@typescript-eslint/utils";

import { arrayIncludes, isDefined } from "ts-extras";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default" | "replaceWithExplicitOrigin";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            "CallExpression[arguments.length>=2][arguments.length<=3][callee.property.name='postMessage']"(
                node: TSESTree.CallExpression
            ) {
                const [, targetOrigin] = node.arguments;

                if (
                    !isDefined(targetOrigin) ||
                    targetOrigin.type !== "Literal" ||
                    targetOrigin.value !== "*"
                ) {
                    return;
                }

                if (
                    isDefined(fullTypeChecker) &&
                    node.callee.type === "MemberExpression"
                ) {
                    const calleeObjectType = getNodeTypeAsString(
                        fullTypeChecker,
                        node.callee.object,
                        context
                    );

                    if (!arrayIncludes(["any", "Window"], calleeObjectType)) {
                        return;
                    }
                }

                context.report({
                    messageId: "default",
                    node: targetOrigin,
                    suggest: [
                        {
                            fix(fixer) {
                                return fixer.replaceText(
                                    targetOrigin,
                                    "location.origin"
                                );
                            },
                            messageId: "replaceWithExplicitOrigin",
                        },
                    ],
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow '*' targetOrigin in postMessage calls to prevent cross-origin data leakage.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-postmessage-star-origin",
        },
        hasSuggestions: true,
        messages: {
            default:
                "Do not use '*' as targetOrigin when sending data with postMessage.",
            replaceWithExplicitOrigin:
                "Replace '*' with a specific trusted origin, such as location.origin.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-postmessage-star-origin",
});

export default rule;
