/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const hasNgBindHtmlPattern = (text: string): boolean =>
    /\bng-bind-html\b/iu.test(text);

const hasKnownSanitizePattern = (text: string): boolean =>
    /\b(?:ngsanitize|\$sanitize|sanitize)\b/iu.test(text);

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
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
                "disallow AngularJS ng-bind-html usage without explicit sanitization context.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-ng-bind-html-without-sanitize",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
