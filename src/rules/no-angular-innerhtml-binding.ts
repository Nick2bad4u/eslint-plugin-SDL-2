import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const hasInnerHtmlBindingPattern = (text: string): boolean =>
    /\[\s*innerhtml\s*\]\s*=/iu.test(text);

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            Literal(node: TSESTree.Literal) {
                if (typeof node.value !== "string") {
                    return;
                }

                if (!hasInnerHtmlBindingPattern(node.value)) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
            TemplateLiteral(node: TSESTree.TemplateLiteral) {
                if (node.expressions.length > 0) {
                    return;
                }

                const templateValue = arrayFirst(node.quasis)?.value.cooked;

                if (typeof templateValue !== "string") {
                    return;
                }

                if (!hasInnerHtmlBindingPattern(templateValue)) {
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
                "Disallow Angular [innerHTML] template bindings without a reviewed sanitization/trusted-types strategy.",
        },
        messages: {
            default:
                "Avoid raw [innerHTML] bindings unless input is strictly sanitized by a reviewed policy.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angular-innerhtml-binding",
});

export default rule;
