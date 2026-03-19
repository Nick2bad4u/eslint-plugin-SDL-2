import type { TSESTree } from "@typescript-eslint/utils";

import { getMemberPropertyName } from "./estree-utils.js";

const SANITIZER_NAME_PATTERN = /createhtml|sanitize|trusted/u;

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
    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "parseFromString") {
        return false;
    }

    if (node.callee.object.type !== "NewExpression") {
        return false;
    }

    return (
        node.callee.object.callee.type === "Identifier" &&
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
    if (node.type !== "CallExpression") {
        return false;
    }

    if (node.callee.type === "Identifier") {
        return SANITIZER_NAME_PATTERN.test(node.callee.name.toLowerCase());
    }

    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    const propertyName = getMemberPropertyName(node.callee);

    return (
        typeof propertyName === "string" &&
        SANITIZER_NAME_PATTERN.test(propertyName.toLowerCase())
    );
};
