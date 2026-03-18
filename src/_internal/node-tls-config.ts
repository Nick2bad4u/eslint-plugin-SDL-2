import type { TSESTree } from "@typescript-eslint/utils";

import { isDefined, setHas } from "ts-extras";

import { getMemberPropertyName } from "./estree-utils.js";

const NODE_TLS_OBJECT_NAMES = new Set([
    "http2",
    "https",
    "tls",
]);
const NODE_TLS_CALL_METHOD_NAMES = new Set([
    "connect",
    "createSecureContext",
    "createSecureServer",
    "createServer",
    "get",
    "request",
]);

export const isNodeTlsObjectExpression = (
    expression: TSESTree.Expression
): boolean => {
    if (expression.type === "Identifier") {
        return setHas(NODE_TLS_OBJECT_NAMES, expression.name);
    }

    if (expression.type !== "MemberExpression") {
        return false;
    }

    const propertyName = getMemberPropertyName(expression);

    return (
        isDefined(propertyName) && setHas(NODE_TLS_OBJECT_NAMES, propertyName)
    );
};

export const isRelevantNodeTlsCall = (
    callee: TSESTree.CallExpression["callee"]
): boolean => {
    if (callee.type === "Identifier") {
        return callee.name === "createSecureContext";
    }

    if (callee.type !== "MemberExpression") {
        return false;
    }

    const methodName = getMemberPropertyName(callee);

    return (
        isDefined(methodName) &&
        setHas(NODE_TLS_CALL_METHOD_NAMES, methodName) &&
        isNodeTlsObjectExpression(callee.object)
    );
};

export const isRelevantNodeTlsConstructor = (
    callee: TSESTree.NewExpression["callee"]
): boolean => {
    if (callee.type !== "MemberExpression") {
        return false;
    }

    return (
        getMemberPropertyName(callee) === "Agent" &&
        isNodeTlsObjectExpression(callee.object)
    );
};

export const isRelevantNodeTlsOptionsObject = (
    node: TSESTree.ObjectExpression
): boolean => {
    const parentNode = node.parent;

    if (parentNode?.type === "CallExpression") {
        return isRelevantNodeTlsCall(parentNode.callee);
    }

    if (parentNode?.type === "NewExpression") {
        return isRelevantNodeTlsConstructor(parentNode.callee);
    }

    return false;
};

export const isNodeTlsStaticMember = (
    node: TSESTree.AssignmentExpression["left"],
    propertyNames: ReadonlySet<string>
): node is TSESTree.MemberExpression => {
    if (node.type !== "MemberExpression") {
        return false;
    }

    const propertyName = getMemberPropertyName(node);

    return (
        isDefined(propertyName) &&
        setHas(propertyNames, propertyName) &&
        isNodeTlsObjectExpression(node.object)
    );
};
