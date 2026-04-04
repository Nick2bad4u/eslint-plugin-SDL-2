/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const hasInnerHtmlBindingPattern = (text: string): boolean =>
    /\[\s*innerhtml\s*\]\s*=/iu.test(text);

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Angular [innerHTML] template bindings without a reviewed sanitization/trusted-types strategy.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angular-innerhtml-binding",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
