/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticJsxAttributeStringValue,
    getStaticStringValue,
} from "../_internal/estree-utils.js";

type AstUtilsRuleContext = Parameters<typeof getFullTypeChecker>[0];
type MessageIds = "default";

const isJsxIframeElement = (node: TSESTree.JSXOpeningElement): boolean => {
    if (node.name.type !== "JSXIdentifier") {
        return false;
    }

    return node.name.name.toLowerCase() === "iframe";
};

const getJsxAttributeName = (
    attributeNode: TSESTree.JSXAttribute
): string | undefined => {
    if (attributeNode.name.type !== "JSXIdentifier") {
        return undefined;
    }

    return attributeNode.name.name.toLowerCase();
};

const isCreateElementIFrameCall = (node: TSESTree.Node): boolean => {
    if (
        node.type !== "CallExpression" ||
        node.callee.type !== "MemberExpression"
    ) {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "createElement") {
        return false;
    }

    const [firstArgument] = node.arguments;

    return (
        firstArgument !== undefined &&
        firstArgument.type !== "SpreadElement" &&
        getStaticStringValue(firstArgument) === "iframe"
    );
};

const isLikelyIFrameElement = (
    node: TSESTree.Node,
    context: AstUtilsRuleContext,
    fullTypeChecker: ReturnType<typeof getFullTypeChecker>
): boolean => {
    if (fullTypeChecker !== undefined) {
        const nodeType = getNodeTypeAsString(fullTypeChecker, node, context);

        if (nodeType === "any" || nodeType.includes("HTMLIFrameElement")) {
            return true;
        }
    }

    if (isCreateElementIFrameCall(node)) {
        return true;
    }

    if (node.type === "Identifier") {
        const normalizedName = node.name.toLowerCase();

        return normalizedName === "frame" || normalizedName.endsWith("iframe");
    }

    if (node.type !== "MemberExpression") {
        return false;
    }

    const propertyName = getMemberPropertyName(node);

    if (typeof propertyName !== "string") {
        return false;
    }

    return propertyName.toLowerCase().endsWith("iframe");
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (node.left.type !== "MemberExpression") {
                    return;
                }

                if (getMemberPropertyName(node.left) !== "srcdoc") {
                    return;
                }

                if (getStaticStringValue(node.right) === "") {
                    return;
                }

                if (
                    !isLikelyIFrameElement(
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
                    getStaticStringValue(firstArgument) !== "srcdoc"
                ) {
                    return;
                }

                if (
                    secondArgument === undefined ||
                    secondArgument.type === "SpreadElement" ||
                    getStaticStringValue(secondArgument) === ""
                ) {
                    return;
                }

                if (
                    !isLikelyIFrameElement(
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
                if (!isJsxIframeElement(node)) {
                    return;
                }

                for (const attributeNode of node.attributes) {
                    if (attributeNode.type !== "JSXAttribute") {
                        continue;
                    }

                    if (getJsxAttributeName(attributeNode) !== "srcdoc") {
                        continue;
                    }

                    if (
                        getStaticJsxAttributeStringValue(
                            attributeNode.value
                        ) === ""
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
                "disallow iframe srcdoc assignments and JSX srcDoc attributes that embed inline HTML documents.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-iframe-srcdoc",
        },
        messages: {
            default:
                "Do not populate iframe srcdoc with inline HTML; load a reviewed document URL instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-iframe-srcdoc",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
