import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isDefined, setHas } from "ts-extras";

import { getMemberPropertyName } from "./estree-utils.js";

type WorkerConstructorName = "SharedWorker" | "Worker";

const WORKER_CONSTRUCTOR_NAMES = new Set(["SharedWorker", "Worker"]);
const GLOBAL_OBJECT_NAMES = new Set([
    "globalThis",
    "self",
    "window",
]);

const isNavigatorObject = (value: Readonly<TSESTree.Expression>): boolean => {
    if (value.type === AST_NODE_TYPES.Identifier) {
        return value.name === "navigator";
    }

    if (value.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    return (
        getMemberPropertyName(value) === "navigator" &&
        value.object.type === AST_NODE_TYPES.Identifier &&
        setHas(GLOBAL_OBJECT_NAMES, value.object.name)
    );
};

/**
 * Check whether a value is a static `blob:` URL.
 *
 * @param value - URL string to inspect.
 *
 * @returns Whether the string starts with `blob:`.
 */
export const isBlobUrl = (value: string): boolean => /^\s*blob:/iv.test(value);

/**
 * Check whether a value is a static `data:` URL.
 *
 * @param value - URL string to inspect.
 *
 * @returns Whether the string starts with `data:`.
 */
export const isDataUrl = (value: string): boolean => /^\s*data:/iv.test(value);

const isWorkerConstructorName = (
    value: string | undefined
): value is WorkerConstructorName =>
    isDefined(value) && setHas(WORKER_CONSTRUCTOR_NAMES, value);

const isGlobalObjectName = (value: string): boolean =>
    setHas(GLOBAL_OBJECT_NAMES, value);

/**
 * Check whether an expression is one of the common global objects used for
 * worker-related APIs.
 *
 * @param value - Expression to inspect.
 *
 * @returns Whether the expression is `window`, `self`, or `globalThis`.
 */
export const isWorkerGlobalObject = (
    value: Readonly<TSESTree.Expression>
): boolean =>
    value.type === AST_NODE_TYPES.Identifier && isGlobalObjectName(value.name);

/**
 * Check whether a constructor callee targets `Worker` or `SharedWorker`.
 *
 * @param callee - Constructor callee to inspect.
 *
 * @returns Whether the callee is a worker constructor.
 */
export const isWorkerConstructor = (
    callee: Readonly<TSESTree.NewExpression["callee"]>
): boolean => {
    if (callee.type === AST_NODE_TYPES.Identifier) {
        return isWorkerConstructorName(callee.name);
    }

    if (callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    return (
        isWorkerConstructorName(getMemberPropertyName(callee)) &&
        isWorkerGlobalObject(callee.object)
    );
};

/**
 * Check whether a call targets `importScripts(...)`.
 *
 * @param callee - Call callee to inspect.
 *
 * @returns Whether the callee is an importScripts sink.
 */
export const isImportScriptsCall = (
    callee: Readonly<TSESTree.CallExpression["callee"]>
): boolean => {
    if (callee.type === AST_NODE_TYPES.Identifier) {
        return callee.name === "importScripts";
    }

    if (callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    return (
        getMemberPropertyName(callee) === "importScripts" &&
        isWorkerGlobalObject(callee.object)
    );
};

/**
 * Check whether an expression resolves the service worker container from
 * `navigator.serviceWorker`.
 *
 * @param value - Expression to inspect.
 *
 * @returns Whether the expression is a service worker container access.
 */
export const isServiceWorkerContainerAccess = (
    value: Readonly<TSESTree.Expression>
): value is TSESTree.MemberExpression => {
    if (value.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    return (
        getMemberPropertyName(value) === "serviceWorker" &&
        isNavigatorObject(value.object)
    );
};

/**
 * Check whether a call targets `navigator.serviceWorker.register(...)`.
 *
 * @param callee - Call callee to inspect.
 *
 * @returns Whether the callee is a service worker registration sink.
 */
export const isServiceWorkerRegisterCall = (
    callee: Readonly<TSESTree.CallExpression["callee"]>
): boolean =>
    callee.type === AST_NODE_TYPES.MemberExpression &&
    getMemberPropertyName(callee) === "register" &&
    isServiceWorkerContainerAccess(callee.object);

const isGlobalUrlObject = (
    node: Readonly<TSESTree.MemberExpression>
): boolean => {
    if (getMemberPropertyName(node) !== "URL") {
        return false;
    }

    return (
        node.object.type === AST_NODE_TYPES.Identifier &&
        isGlobalObjectName(node.object.name)
    );
};

/**
 * Check whether an expression is a direct `URL.createObjectURL(...)` call.
 *
 * @param node - Expression to inspect.
 *
 * @returns Whether the expression creates an object URL from the global URL
 *   API.
 */
export const isUrlCreateObjectUrlCall = (
    node: Readonly<TSESTree.Expression>
): node is TSESTree.CallExpression => {
    if (
        node.type !== AST_NODE_TYPES.CallExpression ||
        node.callee.type !== AST_NODE_TYPES.MemberExpression
    ) {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "createObjectURL") {
        return false;
    }

    return (
        (node.callee.object.type === AST_NODE_TYPES.Identifier &&
            node.callee.object.name === "URL") ||
        (node.callee.object.type === AST_NODE_TYPES.MemberExpression &&
            isGlobalUrlObject(node.callee.object))
    );
};
