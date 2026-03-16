import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayIncludes } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

const isExplicitlyDisabledSvgLiteral = (
    argument: TSESTree.Node | undefined
): boolean =>
    argument?.type === "Literal" &&
    arrayIncludes(
        [
            0,
            "0",
            false,
            "false",
        ],
        argument.value
    );

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
