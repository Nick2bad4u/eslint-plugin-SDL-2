import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { safeCastTo } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

const defaultBlocklist: readonly RegExp[] = [/^(ftp|http|telnet|ws):\/\//iu];

const defaultExceptions: readonly RegExp[] = [
    /^http:(\/\/|\\u002f\\u002f)schemas\.microsoft\.com(\/\/|\\u002f\\u002f)?.*/iu,
    /^http:(\/\/|\\u002f\\u002f)schemas\.openxmlformats\.org(\/\/|\\u002f\\u002f)?.*/iu,
    /^http:(\/|\\u002f){2}localhost(:|\/|\\u002f)*/iu,
    /^http:(\/\/)w{3}\.w3\.org\/1999\/xhtml/iu,
    /^http:(\/\/)w{3}\.w3\.org\/2000\/svg/iu,
];

const defaultVariableExceptions: readonly RegExp[] = [];

type MessageIds = "doNotUseInsecureUrl";

type NoInsecureUrlOptions = Readonly<{
    blocklist?: readonly string[];
    exceptions?: readonly string[];
    varExceptions?: readonly string[];
}>;

type Options = [NoInsecureUrlOptions];

const asCaseInsensitiveRegex = (pattern: RegExp | string): RegExp =>
    pattern instanceof RegExp
        ? new RegExp(pattern.source, "iu")
        : new RegExp(pattern, "iu");

const matches = (patterns: readonly RegExp[], value: string): boolean =>
    patterns.some((pattern) => pattern.test(value));

const shouldAttemptFix = (
    variableExceptions: readonly RegExp[],
    context: TSESLint.RuleContext<MessageIds, Options>,
    node: TSESTree.Node
): boolean => {
    const targetNode = node.parent ?? node;
    const targetText = context.sourceCode.getText(targetNode);

    return !matches(variableExceptions, targetText);
};

const reportInsecureUrl = (
    context: TSESLint.RuleContext<MessageIds, Options>,
    node: TSESTree.Node,
    replacementSourceText: string
): void => {
    context.report({
        fix(fixer) {
            if (!/http:/iu.test(replacementSourceText)) {
                return null;
            }

            return fixer.replaceText(
                node,
                replacementSourceText.replace(/http:/iu, "https:")
            );
        },
        messageId: "doNotUseInsecureUrl",
        node,
    });
};

const rule: TSESLint.RuleModule<MessageIds, Options> = createRule<
    Options,
    MessageIds
>({
    create(context) {
        const [options = {}] = context.options;
        const blocklist = (options.blocklist ?? defaultBlocklist).map(
            asCaseInsensitiveRegex
        );
        const exceptions = (options.exceptions ?? defaultExceptions).map(
            asCaseInsensitiveRegex
        );
        const variableExceptions = (
            options.varExceptions ?? defaultVariableExceptions
        ).map(asCaseInsensitiveRegex);

        return {
            Literal(node) {
                if (typeof node.value !== "string") {
                    return;
                }

                if (
                    node.parent?.type === "JSXAttribute" &&
                    node.parent.name.type === "JSXIdentifier" &&
                    node.parent.name.name === "xmlns"
                ) {
                    return;
                }

                if (
                    !matches(blocklist, node.value) ||
                    matches(exceptions, node.value)
                ) {
                    return;
                }

                if (!shouldAttemptFix(variableExceptions, context, node)) {
                    return;
                }

                reportInsecureUrl(context, node, JSON.stringify(node.value));
            },
            TemplateElement(node) {
                if (
                    typeof node.value.raw !== "string" ||
                    typeof node.value.cooked !== "string"
                ) {
                    return;
                }

                const isRawMatch =
                    shouldAttemptFix(variableExceptions, context, node) &&
                    matches(blocklist, node.value.raw) &&
                    !matches(exceptions, node.value.raw);
                const isCookedMatch =
                    matches(blocklist, node.value.cooked) &&
                    !matches(exceptions, node.value.cooked);

                if (!isRawMatch && !isCookedMatch) {
                    return;
                }

                const escapedTemplatePart = JSON.stringify(
                    context.sourceCode.getText(node)
                ).slice(1, -1);

                reportInsecureUrl(context, node, escapedTemplatePart);
            },
        };
    },
    defaultOptions: safeCastTo<Options>([{}]),
    meta: {
        docs: {
            description:
                "Disallow insecure URL protocols such as http:// and ftp:// with configurable exceptions.",
        },
        fixable: "code",
        messages: {
            doNotUseInsecureUrl: "Do not use insecure URLs.",
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    blocklist: {
                        items: { type: "string" },
                        type: "array",
                    },
                    exceptions: {
                        items: { type: "string" },
                        type: "array",
                    },
                    varExceptions: {
                        items: { type: "string" },
                        type: "array",
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-insecure-url",
});

export { defaultBlocklist, defaultExceptions, defaultVariableExceptions };
export default rule;
