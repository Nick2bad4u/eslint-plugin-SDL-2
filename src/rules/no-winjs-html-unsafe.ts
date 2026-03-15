import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        return {
            "CallExpression[callee.object.object.name='WinJS'][callee.object.property.name='Utilities'][callee.property.name=/^(?:insertAdjacent|setInner|setOuter)HTMLUnsafe$/]"(
                node
            ) {
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
                "Disallow WinJS.Utilities unsafe HTML write APIs (setInnerHTMLUnsafe, setOuterHTMLUnsafe, insertAdjacentHTMLUnsafe).",
        },
        messages: {
            default:
                "Do not set HTML using unsafe methods from WinJS.Utilities.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-winjs-html-unsafe",
});

export default rule;
