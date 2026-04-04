import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow bypassing Angular DomSanitizer trust APIs such as bypassSecurityTrustHtml.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angular-bypass-sanitizer",
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
