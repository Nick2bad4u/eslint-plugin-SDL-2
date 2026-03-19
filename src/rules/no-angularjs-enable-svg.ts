/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
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
        deprecated: false,
        docs: {
            description:
                "disallow enabling AngularJS sanitizer SVG support via $sanitizeProvider.enableSvg(true).",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-enable-svg",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
