import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayAt, arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getStaticStringValue = (
    node: TSESTree.Expression
): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
        return arrayFirst(node.quasis)?.value.cooked ?? undefined;
    }

    return undefined;
};

const isOnMemberExpression = (
    callee: TSESTree.CallExpression["callee"]
): boolean => {
    if (callee.type !== "MemberExpression" || callee.computed) {
        return false;
    }

    return (
        callee.property.type === "Identifier" && callee.property.name === "on"
    );
};

const getCallbackParameterName = (
    node: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression
): string | undefined => {
    const callbackParameter = arrayAt(node.params, -1);

    return callbackParameter?.type === "Identifier"
        ? callbackParameter.name
        : undefined;
};

const toUnsafeCallbackTruePattern = (callbackName: string): RegExp =>
    new RegExp(String.raw`\b${callbackName}\s*\(\s*true\b`, "u");

const hasUnsafeCallbackTrueCall = (
    callbackName: string,
    handlerNode: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
    context: TSESLint.RuleContext<MessageIds, unknown[]>
): boolean => {
    const handlerSourceText = context.sourceCode.getText(handlerNode);

    return toUnsafeCallbackTruePattern(callbackName).test(handlerSourceText);
};

const isCertificateErrorEventRegistration = (
    node: TSESTree.CallExpression
): boolean => {
    if (!isOnMemberExpression(node.callee)) {
        return false;
    }

    const [firstArgument] = node.arguments;

    if (firstArgument === undefined || firstArgument.type === "SpreadElement") {
        return false;
    }

    return getStaticStringValue(firstArgument) === "certificate-error";
};

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isCertificateErrorEventRegistration(node)) {
                    return;
                }

                const [, secondArgument] = node.arguments;

                if (
                    secondArgument === undefined ||
                    secondArgument.type === "SpreadElement"
                ) {
                    return;
                }

                if (
                    secondArgument.type !== "ArrowFunctionExpression" &&
                    secondArgument.type !== "FunctionExpression"
                ) {
                    return;
                }

                const callbackParameterName =
                    getCallbackParameterName(secondArgument);

                if (typeof callbackParameterName !== "string") {
                    return;
                }

                if (
                    !hasUnsafeCallbackTrueCall(
                        callbackParameterName,
                        secondArgument,
                        context
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: secondArgument,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow Electron certificate-error handlers that call the callback with true.",
        },
        messages: {
            default:
                "Do not bypass certificate validation by calling the certificate-error callback with true.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-insecure-certificate-error-handler",
});

export default rule;
