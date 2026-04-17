import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], "default">({
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow WinJS.Utilities unsafe HTML write APIs (setInnerHTMLUnsafe, setOuterHTMLUnsafe, insertAdjacentHTMLUnsafe).",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-winjs-html-unsafe",
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
