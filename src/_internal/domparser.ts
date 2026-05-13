import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { getMemberPropertyName } from "./estree-utils.js";

const SANITIZER_NAME_PATTERN = /createhtml|sanitize|trusted/v;

/**
 * Check whether a call is `new DOMParser().parseFromString(...)`.
 *
 * @param node - Call expression to inspect.
 *
 * @returns Whether the call matches the DOMParser parsing sink.
 */
export const isDomParserParseFromStringCall = (
    node: Readonly<TSESTree.CallExpression>
): boolean => {
    if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "parseFromString") {
        return false;
    }

    if (node.callee.object.type !== AST_NODE_TYPES.NewExpression) {
        return false;
    }

    return (
        node.callee.object.callee.type === AST_NODE_TYPES.Identifier &&
        node.callee.object.callee.name === "DOMParser"
    );
};

/**
 * Check whether an expression appears to run through a sanitizer or trusted
 * policy helper.
 *
 * @param node - Expression to inspect.
 *
 * @returns Whether the expression is an explicit sanitization call.
 */
export const isSanitizedExpression = (
    node: Readonly<TSESTree.Expression>
): boolean => {
    if (node.type !== AST_NODE_TYPES.CallExpression) {
        return false;
    }

    if (node.callee.type === AST_NODE_TYPES.Identifier) {
        return SANITIZER_NAME_PATTERN.test(node.callee.name.toLowerCase());
    }

    if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    const propertyName = getMemberPropertyName(node.callee);

    return (
        typeof propertyName === "string" &&
        SANITIZER_NAME_PATTERN.test(propertyName.toLowerCase())
    );
};
