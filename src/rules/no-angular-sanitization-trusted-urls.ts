import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
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
        deprecated: false,
        docs: {
            description:
                "disallow AngularJS trusted URL list mutations via $compileProvider.*SanitizationTrustedUrlList.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angular-sanitization-trusted-urls",
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
