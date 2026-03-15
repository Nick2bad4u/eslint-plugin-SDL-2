import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const isSceProviderEnabledSafeLiteral = (argument: TSESTree.Node): boolean =>
    argument.type === "Literal" &&
    [
        1,
        "1",
        true,
        "true",
    ].includes(argument.value as never);

const isEmptyLiteral = (argument: TSESTree.Node): boolean =>
    argument.type === "Literal" && argument.value === "";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        const report = (node: TSESTree.Node): void => {
            context.report({
                messageId: "doNotBypass",
                node,
            });
        };

        return {
            "CallExpression[arguments.length>0][callee.object.name='$sce'][callee.property.name=/^trustAs(?:css|html|js|resourceurl|url)?$/i]"(
                node: TSESTree.CallExpression
            ) {
                const firstArgument = node.arguments[0];

                if (
                    node.arguments.length === 1 &&
                    firstArgument !== undefined &&
                    isEmptyLiteral(firstArgument)
                ) {
                    return;
                }

                report(node);
            },
            "CallExpression[arguments.length>0][callee.object.name='$sceDelegate'][callee.property.name='trustAs']"(
                node: TSESTree.CallExpression
            ) {
                report(node);
            },
            "CallExpression[arguments.length>0][callee.object.name='$sceProvider'][callee.property.name='enabled']"(
                node: TSESTree.CallExpression
            ) {
                if (node.arguments.length !== 1) {
                    return;
                }

                const firstArgument = node.arguments[0];

                if (
                    firstArgument !== undefined &&
                    isSceProviderEnabledSafeLiteral(firstArgument)
                ) {
                    return;
                }

                report(node);
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow bypasses of AngularJS Strict Contextual Escaping ($sce, $sceDelegate, $sceProvider).",
        },
        messages: {
            doNotBypass:
                "Do not bypass AngularJS Strict Contextual Escaping (SCE).",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angularjs-bypass-sce",
});

export default rule;
