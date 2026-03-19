/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getStaticTemplateLiteralValue = (
    templateLiteral: TSESTree.TemplateLiteral
): string | undefined => {
    if (templateLiteral.expressions.length > 0) {
        return undefined;
    }

    return arrayFirst(templateLiteral.quasis)?.value.cooked ?? undefined;
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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
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
        deprecated: false,
        docs: {
            description:
                "disallow untrusted or non-HTTPS/non-mailto URLs in Electron shell.openExternal calls.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-untrusted-open-external",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
