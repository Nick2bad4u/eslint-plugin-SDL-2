import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        return {
            "CallExpression[arguments.length>0][callee.property.name=/^bypassSecurityTrust(?:html|resourceurl|script|style|url)$/i]"(
                node
            ) {
                context.report({
                    messageId: "noBypass",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow bypassing Angular DomSanitizer trust APIs such as bypassSecurityTrustHtml.",
        },
        messages: {
            noBypass: "Do not bypass Angular's built-in sanitizer.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angular-bypass-sanitizer",
});

export default rule;
