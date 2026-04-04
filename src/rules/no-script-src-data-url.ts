/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { getFullTypeChecker } from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticJsxAttributeStringValue,
    getStaticStringValue,
} from "../_internal/estree-utils.js";
import { isLikelyScriptElement } from "../_internal/script-element.js";

type MessageIds = "default";

const isDataUrl = (value: string): boolean => /^\s*data:/iu.test(value);

const isJsxScriptElement = (node: TSESTree.JSXOpeningElement): boolean =>
    node.name.type === "JSXIdentifier" &&
    node.name.name.toLowerCase() === "script";

const getJsxAttributeName = (
    attributeNode: TSESTree.JSXAttribute
): string | undefined => {
    if (attributeNode.name.type !== "JSXIdentifier") {
        return undefined;
    }

    return attributeNode.name.name.toLowerCase();
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (node.left.type !== "MemberExpression") {
                    return;
                }

                if (getMemberPropertyName(node.left) !== "src") {
                    return;
                }

                const configuredValue = getStaticStringValue(node.right);

                if (
                    typeof configuredValue !== "string" ||
                    !isDataUrl(configuredValue) ||
                    !isLikelyScriptElement(
                        node.left.object,
                        context,
                        fullTypeChecker
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: node.right,
                });
            },
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                const methodName = getMemberPropertyName(node.callee);

                if (
                    methodName !== "setAttribute" &&
                    methodName !== "setAttributeNS"
                ) {
                    return;
                }

                const [firstArgument, secondArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement" ||
                    getStaticStringValue(firstArgument) !== "src" ||
                    secondArgument === undefined ||
                    secondArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const configuredValue = getStaticStringValue(secondArgument);

                if (
                    typeof configuredValue !== "string" ||
                    !isDataUrl(configuredValue) ||
                    !isLikelyScriptElement(
                        node.callee.object,
                        context,
                        fullTypeChecker
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: secondArgument,
                });
            },
            JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
                if (!isJsxScriptElement(node)) {
                    return;
                }

                for (const attributeNode of node.attributes) {
                    if (attributeNode.type !== "JSXAttribute") {
                        continue;
                    }

                    if (getJsxAttributeName(attributeNode) !== "src") {
                        continue;
                    }

                    const staticValue = getStaticJsxAttributeStringValue(
                        attributeNode.value
                    );

                    if (
                        typeof staticValue !== "string" ||
                        !isDataUrl(staticValue)
                    ) {
                        continue;
                    }

                    context.report({
                        messageId: "default",
                        node: attributeNode,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow HTMLScriptElement src values that load executable code from data: URLs.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-script-src-data-url",
        },
        messages: {
            default:
                "Do not load script code from a data: URL; use a reviewed external resource or module instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-script-src-data-url",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
