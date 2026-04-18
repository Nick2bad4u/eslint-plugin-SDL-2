import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<
    [],
    "noSanitizationWhitelist"
>({
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow AngularJS sanitizer whitelist mutations via $compileProvider.*SanitizationWhitelist.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-sanitization-whitelist",
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
