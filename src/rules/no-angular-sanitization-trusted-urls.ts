import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        return {
            "CallExpression[arguments.length>0][callee.object.name='$compileProvider'][callee.property.name=/^(?:aHref|imgSrc)SanitizationTrustedUrlList$/]"(
                node
            ) {
                context.report({
                    messageId: "noSanitizationTrustedUrls",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow AngularJS trusted URL list mutations via $compileProvider.*SanitizationTrustedUrlList.",
        },
        messages: {
            noSanitizationTrustedUrls:
                "Do not modify AngularJS sanitization trusted URL lists.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angular-sanitization-trusted-urls",
});

export default rule;
