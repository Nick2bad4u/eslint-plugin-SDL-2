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

/**
 * Check whether an expression targets a Node TLS-capable module object.
 *
 * @param expression - Expression to inspect.
 *
 * @returns Whether the expression resolves to `tls`, `https`, or `http2`.
 */
export const isNodeTlsObjectExpression = (
    expression: Readonly<TSESTree.Expression>
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

/**
 * Check whether a call expression targets a relevant Node TLS API sink.
 *
 * @param callee - Call-expression callee to inspect.
 *
 * @returns Whether the callee matches a TLS-relevant call site.
 */
export const isRelevantNodeTlsCall = (
    callee: Readonly<TSESTree.CallExpression["callee"]>
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

/**
 * Check whether a constructor call targets a relevant Node TLS constructor.
 *
 * @param callee - New-expression callee to inspect.
 *
 * @returns Whether the callee matches a TLS-relevant constructor site.
 */
export const isRelevantNodeTlsConstructor = (
    callee: Readonly<TSESTree.NewExpression["callee"]>
): boolean => {
    if (callee.type !== "MemberExpression") {
        return false;
    }

    return (
        getMemberPropertyName(callee) === "Agent" &&
        isNodeTlsObjectExpression(callee.object)
    );
};

/**
 * Check whether an object literal is being used as options for a relevant Node
 * TLS API.
 *
 * @param node - Object expression to inspect.
 *
 * @returns Whether the object expression belongs to a TLS-relevant call site.
 */
export const isRelevantNodeTlsOptionsObject = (
    node: Readonly<TSESTree.ObjectExpression>
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

/**
 * Check whether an assignment left-hand side targets a static TLS member.
 *
 * @param node - Assignment left-hand side expression to inspect.
 * @param propertyNames - Allowed member names for matching.
 *
 * @returns Whether the node matches one of the targeted TLS static members.
 */
export const isNodeTlsStaticMember = (
    node: Readonly<TSESTree.AssignmentExpression["left"]>,
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
