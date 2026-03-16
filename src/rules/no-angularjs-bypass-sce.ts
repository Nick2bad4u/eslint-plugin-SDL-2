import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayFirst, arrayIncludes } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

const isEmptyLiteral = (argument: TSESTree.Node | undefined): boolean =>
    argument?.type === "Literal" && argument.value === "";

const isSceProviderEnabledSafeLiteral = (
    argument: TSESTree.Node | undefined
): boolean =>
    argument?.type === "Literal" &&
    arrayIncludes(
        [
            1,
            "1",
            true,
            "true",
        ],
        argument.value
    );

const isBypassSceMethod = (methodName: string): boolean =>
    arrayIncludes(
        [
            "trustAs",
            "trustAsCss",
            "trustAsHtml",
            "trustAsJs",
            "trustAsResourceUrl",
            "trustAsUrl",
        ],
        methodName
    );

export const noAngularjsBypassSceRule: TSESLint.RuleModule<
    "doNotBypass",
    readonly []
> = createRule({
    create(context): TSESLint.RuleListener {
        const report = (node: TSESTree.CallExpression): void => {
            context.report({
                messageId: "doNotBypass",
                node,
            });
        };

        return {
            "CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name='$sce'][callee.property.type='Identifier']"(
                node: TSESTree.CallExpression
            ) {
                if (
                    node.callee.type !== "MemberExpression" ||
                    node.callee.property.type !== "Identifier"
                ) {
                    return;
                }

                if (!isBypassSceMethod(node.callee.property.name)) {
                    return;
                }

                const firstArgument = arrayFirst(node.arguments);

                if (
                    node.arguments.length === 1 &&
                    isEmptyLiteral(firstArgument)
                ) {
                    return;
                }

                report(node);
            },
            "CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name='$sceProvider'][callee.property.type='Identifier'][callee.property.name='enabled']"(
                node: TSESTree.CallExpression
            ) {
                const firstArgument = arrayFirst(node.arguments);

                if (isSceProviderEnabledSafeLiteral(firstArgument)) {
                    return;
                }

                report(node);
            },
            "CallExpression[callee.type='MemberExpression'][callee.property.type='Identifier'][callee.property.name='trustAs']"(
                node: TSESTree.CallExpression
            ) {
                const firstArgument = arrayFirst(node.arguments);

                if (
                    node.arguments.length === 1 &&
                    isEmptyLiteral(firstArgument)
                ) {
                    return;
                }

                report(node);
            },
        };
    },
    defaultOptions: [] as const,
    meta: {
        docs: {
            description:
                "Forbid AngularJS SCE bypass APIs that trust unvalidated values.",
            url: "https://github.com/Nick2bad4u/eslint-plugin-SDL-2/blob/main/docs/rules/no-angularjs-bypass-sce.md",
        },
        messages: {
            doNotBypass:
                "Do not bypass AngularJS SCE with untrusted values. Validate and sanitize content before marking it trusted.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-angularjs-bypass-sce",
});

export default noAngularjsBypassSceRule;
