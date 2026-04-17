import type { TSESTree } from "@typescript-eslint/utils";

import { isDefined } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import {
    isDomParserParseFromStringCall,
    isSanitizedExpression,
} from "../_internal/domparser.js";
import { getStaticStringValue } from "../_internal/estree-utils.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow DOMParser.parseFromString(..., 'text/html') calls on unsanitized input.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-domparser-html-without-sanitization",
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
