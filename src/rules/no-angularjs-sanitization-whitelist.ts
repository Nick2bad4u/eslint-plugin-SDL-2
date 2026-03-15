import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        return {
            "CallExpression[arguments.length>0][callee.object.name='$compileProvider'][callee.property.name=/^(?:aHref|imgSrc)SanitizationWhitelist$/]"(
                node
            ) {
                context.report({
                    messageId: "noSanitizationWhitelist",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow AngularJS sanitizer whitelist mutations via $compileProvider.*SanitizationWhitelist.",
        },
        messages: {
            noSanitizationWhitelist:
                "Do not modify AngularJS sanitization whitelists.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angularjs-sanitization-whitelist",
});

export default rule;
