import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getStaticTemplateLiteralValue = (
    templateLiteral: TSESTree.TemplateLiteral
): string | undefined => {
    if (templateLiteral.expressions.length > 0) {
        return undefined;
    }

    return templateLiteral.quasis[0]?.value.cooked ?? undefined;
};

const getStringValue = (node: TSESTree.Expression): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (node.type === "TemplateLiteral") {
        return getStaticTemplateLiteralValue(node);
    }

    return undefined;
};

const isAllowedExternalProtocol = (value: string): boolean =>
    /^(?:https|mailto):/iu.test(value.trim());

const getMemberPropertyName = (
    memberExpression: TSESTree.MemberExpression
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === "Identifier"
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === "Literal" &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return undefined;
};

const isShellObjectExpression = (node: TSESTree.Expression): boolean => {
    if (node.type === "Identifier") {
        return node.name === "shell";
    }

    if (node.type !== "MemberExpression") {
        return false;
    }

    return getMemberPropertyName(node) === "shell";
};

const isShellOpenExternalCallee = (
    callee: TSESTree.CallExpression["callee"]
): boolean => {
    if (callee.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(callee) !== "openExternal") {
        return false;
    }

    return isShellObjectExpression(callee.object);
};

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            CallExpression(node) {
                if (!isShellOpenExternalCallee(node.callee)) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const firstArgumentValue = getStringValue(firstArgument);

                if (
                    typeof firstArgumentValue === "string" &&
                    isAllowedExternalProtocol(firstArgumentValue)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: firstArgument,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow untrusted or non-HTTPS/non-mailto URLs in Electron shell.openExternal calls.",
        },
        messages: {
            default:
                "Only open trusted https: or mailto: URLs with shell.openExternal.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-untrusted-open-external",
});

export default rule;
