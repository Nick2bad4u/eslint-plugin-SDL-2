/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";

type AstUtilsRuleContext = Parameters<typeof getFullTypeChecker>[0];
type MessageIds = "default";

const isScriptTextPropertyName = (propertyName: string | undefined): boolean =>
    propertyName === "innerText" ||
    propertyName === "text" ||
    propertyName === "textContent";

const isLikelyScriptIdentifierName = (identifierName: string): boolean =>
    identifierName === "currentScript" ||
    identifierName === "script" ||
    identifierName === "scriptElement" ||
    identifierName.endsWith("Script") ||
    identifierName.endsWith("ScriptElement") ||
    identifierName.endsWith("_script") ||
    identifierName.endsWith("_script_element");

const isCreateElementScriptCall = (node: TSESTree.Node): boolean => {
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
        getStaticStringValue(firstArgument) === "script"
    );
};

const isLikelyScriptElement = (
    node: TSESTree.Node,
    context: AstUtilsRuleContext,
    fullTypeChecker: ReturnType<typeof getFullTypeChecker>
): boolean => {
    if (fullTypeChecker !== undefined) {
        const nodeType = getNodeTypeAsString(fullTypeChecker, node, context);

        if (nodeType.includes("HTMLScriptElement")) {
            return true;
        }
    }

    if (isCreateElementScriptCall(node)) {
        return true;
    }

    if (node.type === "Identifier") {
        return isLikelyScriptIdentifierName(node.name);
    }

    if (node.type !== "MemberExpression") {
        return false;
    }

    const propertyName = getMemberPropertyName(node);

    return (
        typeof propertyName === "string" &&
        (propertyName === "currentScript" ||
            isLikelyScriptIdentifierName(propertyName))
    );
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

                if (
                    !isScriptTextPropertyName(getMemberPropertyName(node.left))
                ) {
                    return;
                }

                if (getStaticStringValue(node.right) === "") {
                    return;
                }

                if (
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
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow assigning executable code through HTMLScriptElement text, textContent, or innerText sinks.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-script-text",
        },
        messages: {
            default:
                "Do not inject executable code through script text sinks; load a reviewed script resource or module instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-script-text",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
