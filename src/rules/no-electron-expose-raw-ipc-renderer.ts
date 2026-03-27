 
import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { getMemberPropertyName } from "../_internal/estree-utils.js";

type MessageIds = "default";

const isExpressionNode = (node: TSESTree.Node): node is TSESTree.Expression =>
    node.type !== "ArrayPattern" &&
    node.type !== "AssignmentPattern" &&
    node.type !== "ObjectPattern";

const isContextBridgeObjectExpression = (
    expression: TSESTree.Expression
): boolean => {
    if (expression.type === "Identifier") {
        return expression.name === "contextBridge";
    }

    if (expression.type !== "MemberExpression") {
        return false;
    }

    return getMemberPropertyName(expression) === "contextBridge";
};

const isContextBridgeExposeCall = (node: TSESTree.CallExpression): boolean => {
    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    const methodName = getMemberPropertyName(node.callee);

    if (
        methodName !== "exposeInIsolatedWorld" &&
        methodName !== "exposeInMainWorld"
    ) {
        return false;
    }

    return isContextBridgeObjectExpression(node.callee.object);
};

const isIpcRendererReference = (expression: TSESTree.Expression): boolean => {
    if (expression.type === "Identifier") {
        return expression.name === "ipcRenderer";
    }

    if (expression.type !== "MemberExpression") {
        return false;
    }

    if (expression.object.type === "Identifier") {
        return expression.object.name === "ipcRenderer";
    }

    if (expression.object.type !== "MemberExpression") {
        return false;
    }

    return getMemberPropertyName(expression.object) === "ipcRenderer";
};

const isUnsafeExposedValue = (expression: TSESTree.Expression): boolean => {
    if (isIpcRendererReference(expression)) {
        return true;
    }

    if (
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        getMemberPropertyName(expression.callee) === "bind" &&
        expression.callee.object.type === "MemberExpression"
    ) {
        return isIpcRendererReference(expression.callee.object);
    }

    if (expression.type === "ArrayExpression") {
        return expression.elements.some(
            (element): element is TSESTree.Expression =>
                element !== null &&
                element.type !== "SpreadElement" &&
                isUnsafeExposedValue(element)
        );
    }

    if (expression.type !== "ObjectExpression") {
        return false;
    }

    return expression.properties.some((propertyNode) => {
        if (propertyNode.type === "SpreadElement") {
            return isUnsafeExposedValue(propertyNode.argument);
        }

        return (
            propertyNode.kind === "init" &&
            isExpressionNode(propertyNode.value) &&
            isUnsafeExposedValue(propertyNode.value)
        );
    });
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isContextBridgeExposeCall(node)) {
                    return;
                }

                const [, exposedValue] = node.arguments;

                if (
                    exposedValue === undefined ||
                    exposedValue.type === "SpreadElement" ||
                    !isUnsafeExposedValue(exposedValue)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: exposedValue,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow exposing raw Electron ipcRenderer objects or methods through contextBridge APIs.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-expose-raw-ipc-renderer",
        },
        messages: {
            default:
                "Expose narrow preload wrapper functions instead of raw ipcRenderer objects or methods.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-expose-raw-ipc-renderer",
});

export default rule;
 
