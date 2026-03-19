/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { safeCastTo } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

/** Default insecure-protocol blocklist patterns. */
const defaultBlocklist: readonly RegExp[] = [/^(?:ftp|http|telnet|ws):\/\//iu];

/** Default allowlisted literal URL exceptions. */
const defaultExceptions: readonly RegExp[] = [
    /^http:(?:\/\/|\\u002f\\u002f)schemas\.microsoft\.com.*/iu,
    /^http:(?:\/\/|\\u002f\\u002f)schemas\.openxmlformats\.org.*/iu,
    /^http:(?:\/|\\u002f){2}localhost(?::|\/|\\u002f)*/iu,
    /^http:\/\/w{3}\.w3\.org\/1999\/xhtml/iu,
    /^http:\/\/w{3}\.w3\.org\/2000\/svg/iu,
];

/** Default source-text exceptions for variable/template contexts. */
const defaultVariableExceptions: readonly RegExp[] = [];

type MessageIds = "doNotUseInsecureUrl";

type NoInsecureUrlOptions = Readonly<{
    blocklist?: readonly string[];
    exceptions?: readonly string[];
    varExceptions?: readonly string[];
}>;

type Options = [NoInsecureUrlOptions];

const asCaseInsensitiveRegex = (pattern: RegExp | string): RegExp => {
    if (pattern instanceof RegExp) {
        // eslint-disable-next-line security/detect-non-literal-regexp -- Rebuild trusted RegExp source with normalized flags only.
        return new RegExp(pattern.source, "iu");
    }

    // eslint-disable-next-line security/detect-non-literal-regexp -- User-configured regex patterns are intentionally compiled for matching behavior.
    return new RegExp(pattern, "iu");
};

const matches = (patterns: readonly RegExp[], value: string): boolean =>
    patterns.some((pattern) => pattern.test(value));

const toRegexSources = (patterns: readonly RegExp[]): readonly string[] =>
    patterns.map((pattern) => pattern.source);

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

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<Options, MessageIds>({
    create(context) {
        const [options = {}] = context.options;
        const blocklist = (options.blocklist ?? defaultBlocklist).map(
            (pattern) => asCaseInsensitiveRegex(pattern)
        );
        const exceptions = (options.exceptions ?? defaultExceptions).map(
            (pattern) => asCaseInsensitiveRegex(pattern)
        );
        const variableExceptions = (
            options.varExceptions ?? defaultVariableExceptions
        ).map((pattern) => asCaseInsensitiveRegex(pattern));

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
    defaultOptions: safeCastTo<Options>([
        {
            blocklist: toRegexSources(defaultBlocklist),
            exceptions: toRegexSources(defaultExceptions),
            varExceptions: toRegexSources(defaultVariableExceptions),
        },
    ]),
    meta: {
        defaultOptions: [
            {
                blocklist: toRegexSources(defaultBlocklist),
                exceptions: toRegexSources(defaultExceptions),
                varExceptions: toRegexSources(defaultVariableExceptions),
            },
        ],
        deprecated: false,
        docs: {
            description:
                "disallow insecure URL protocols such as http:// and ftp:// with configurable exceptions.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-insecure-url",
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
                        description:
                            "Regular-expression strings that identify insecure URL patterns to block.",
                        items: { type: "string" },
                        type: "array",
                    },
                    exceptions: {
                        description:
                            "Regular-expression strings that identify allowed URL literals excluded from blocklist checks.",
                        items: { type: "string" },
                        type: "array",
                    },
                    varExceptions: {
                        description:
                            "Regular-expression strings that identify source-text contexts where automatic fixing should be skipped.",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
