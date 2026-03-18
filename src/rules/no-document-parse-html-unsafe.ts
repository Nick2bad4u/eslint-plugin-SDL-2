/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

const isDocumentConstructorReference = (
    expression: TSESTree.Expression
): boolean => {
    if (expression.type === "Identifier") {
        return expression.name === "Document";
    }

    if (expression.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(expression) !== "Document") {
        return false;
    }

    return (
        expression.object.type === "Identifier" &&
        (expression.object.name === "globalThis" ||
            expression.object.name === "self" ||
            expression.object.name === "window")
    );
};

const isDocumentParseHtmlUnsafeCall = (
    node: TSESTree.CallExpression
): boolean => {
    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "parseHTMLUnsafe") {
        return false;
    }

    return isDocumentConstructorReference(node.callee.object);
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isDocumentParseHtmlUnsafeCall(node)) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument !== undefined &&
                    firstArgument.type !== "SpreadElement" &&
                    getStaticStringValue(firstArgument) === ""
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: firstArgument ?? node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Document.parseHTMLUnsafe() because it preserves unsafe HTML unless a reviewed sanitization path is enforced separately.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-parse-html-unsafe",
        },
        messages: {
            default:
                "Do not call Document.parseHTMLUnsafe(); prefer Document.parseHTML() or a reviewed sanitization pipeline.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-document-parse-html-unsafe",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
