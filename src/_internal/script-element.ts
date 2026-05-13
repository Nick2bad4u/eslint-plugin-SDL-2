import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { type getFullTypeChecker, getNodeTypeAsString } from "./ast-utils.js";
import { getMemberPropertyName, getStaticStringValue } from "./estree-utils.js";

/** ESLint rule context shape accepted by AST/type helper utilities. */
export type AstUtilsRuleContext = Parameters<typeof getFullTypeChecker>[0];

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
        node.type !== AST_NODE_TYPES.CallExpression ||
        node.callee.type !== AST_NODE_TYPES.MemberExpression
    ) {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "createElement") {
        return false;
    }

    const [firstArgument] = node.arguments;

    return (
        firstArgument !== undefined &&
        firstArgument.type !== AST_NODE_TYPES.SpreadElement &&
        getStaticStringValue(firstArgument) === "script"
    );
};

/** Returns whether an AST node likely refers to an `HTMLScriptElement`. */
export const isLikelyScriptElement = (
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

    if (node.type === AST_NODE_TYPES.Identifier) {
        return isLikelyScriptIdentifierName(node.name);
    }

    if (node.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    const propertyName = getMemberPropertyName(node);

    return (
        typeof propertyName === "string" &&
        (propertyName === "currentScript" ||
            isLikelyScriptIdentifierName(propertyName))
    );
};
