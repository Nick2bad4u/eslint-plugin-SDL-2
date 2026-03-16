import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const hasNgBindHtmlPattern = (text: string): boolean =>
    /\bng-bind-html\b/iu.test(text);

const hasKnownSanitizePattern = (text: string): boolean =>
    /\b(?:ngsanitize|\$sanitize|sanitize)\b/iu.test(text);

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            Literal(node: TSESTree.Literal) {
                if (typeof node.value !== "string") {
                    return;
                }

                if (!hasNgBindHtmlPattern(node.value)) {
                    return;
                }

                if (hasKnownSanitizePattern(node.value)) {
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

                if (!hasNgBindHtmlPattern(templateValue)) {
                    return;
                }

                if (hasKnownSanitizePattern(templateValue)) {
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
                "Disallow AngularJS ng-bind-html usage without explicit sanitization context.",
        },
        messages: {
            default:
                "Avoid ng-bind-html unless sanitization is explicitly configured and enforced.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angularjs-ng-bind-html-without-sanitize",
});

export default rule;
