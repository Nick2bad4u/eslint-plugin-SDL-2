/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst, isDefined } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

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

const isSanitizedExpression = (node: TSESTree.Expression): boolean => {
    if (node.type !== "CallExpression") {
        return false;
    }

    if (node.callee.type === "Identifier") {
        return /createhtml|sanitize|trusted/u.test(
            node.callee.name.toLowerCase()
        );
    }

    if (node.callee.type === "MemberExpression") {
        const propertyName = getMemberPropertyName(node.callee);

        if (typeof propertyName !== "string") {
            return false;
        }

        return /createhtml|sanitize|trusted/u.test(propertyName.toLowerCase());
    }

    return false;
};

const isDomParserParseFromStringCall = (
    node: TSESTree.CallExpression
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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isDomParserParseFromStringCall(node)) {
                    return;
                }

                if (node.arguments.length < 2) {
                    return;
                }

                const [firstArgument, secondArgument] = node.arguments;

                if (!isDefined(firstArgument) || !isDefined(secondArgument)) {
                    return;
                }

                if (
                    firstArgument.type === "SpreadElement" ||
                    secondArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const mimeTypeValue = getStaticStringValue(secondArgument);

                if (mimeTypeValue !== "text/html") {
                    return;
                }

                if (isSanitizedExpression(firstArgument)) {
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
                "disallow DOMParser.parseFromString(..., 'text/html') calls on unsanitized input.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-domparser-html-without-sanitization",
        },
        messages: {
            default:
                "Sanitize HTML input before parsing with DOMParser.parseFromString(..., 'text/html').",
        },
        schema: [],
        type: "problem",
    },
    name: "no-domparser-html-without-sanitization",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
