import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const isExplicitlyDisabledSvgLiteral = (argument: TSESTree.Node): boolean =>
    argument.type === "Literal" &&
    [
        0,
        "0",
        false,
        "false",
    ].includes(argument.value as never);

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        return {
            "CallExpression[callee.object.name='$sanitizeProvider'][callee.property.name='enableSvg']"(
                node: TSESTree.CallExpression
            ) {
                if (node.arguments.length !== 1) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (!firstArgument) {
                    return;
                }

                if (isExplicitlyDisabledSvgLiteral(firstArgument)) {
                    return;
                }

                context.report({
                    messageId: "doNotEnableSVG",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow enabling AngularJS sanitizer SVG support via $sanitizeProvider.enableSvg(true).",
        },
        messages: {
            doNotEnableSVG: "Do not enable SVG support in AngularJS sanitizer.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angularjs-enable-svg",
});

export default rule;
