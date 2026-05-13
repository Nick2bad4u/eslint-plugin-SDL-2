/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isDefined, setHas } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const TRUSTED_TYPE_NAMES = new Set([
    "TrustedHTML",
    "TrustedScript",
    "TrustedScriptURL",
]);

const getTypeName = (node: TSESTree.TypeNode): string | undefined => {
    if (
        node.type === AST_NODE_TYPES.TSTypeReference &&
        node.typeName.type === AST_NODE_TYPES.Identifier
    ) {
        return node.typeName.name;
    }

    return undefined;
};

const isTrustedTypeNode = (node: TSESTree.TypeNode): boolean => {
    const typeName = getTypeName(node);

    return isDefined(typeName) && setHas(TRUSTED_TYPE_NAMES, typeName);
};

const getExpressionCalleeName = (
    expression: TSESTree.Expression
): string | undefined => {
    if (expression.type !== AST_NODE_TYPES.CallExpression) {
        return undefined;
    }

    if (expression.callee.type === AST_NODE_TYPES.Identifier) {
        return expression.callee.name;
    }

    if (
        expression.callee.type === AST_NODE_TYPES.MemberExpression &&
        !expression.callee.computed &&
        expression.callee.property.type === AST_NODE_TYPES.Identifier
    ) {
        return expression.callee.property.name;
    }

    return undefined;
};

const isKnownTrustedFactoryCall = (
    expression: TSESTree.Expression
): boolean => {
    const calleeName = getExpressionCalleeName(expression);

    if (!isDefined(calleeName)) {
        return false;
    }

    return /sanitize|createhtml|createscripturl|createscript|trusted/v.test(
        calleeName.toLowerCase()
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            TSAsExpression(node: TSESTree.TSAsExpression) {
                if (!isTrustedTypeNode(node.typeAnnotation)) {
                    return;
                }

                if (isKnownTrustedFactoryCall(node.expression)) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
            TSTypeAssertion(node: TSESTree.TSTypeAssertion) {
                if (!isTrustedTypeNode(node.typeAnnotation)) {
                    return;
                }

                if (isKnownTrustedFactoryCall(node.expression)) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow unsafe casts to Trusted Types without validated/trusted factory paths.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-unsafe-cast-to-trusted-types",
        },
        messages: {
            default: "Do not cast unvalidated values to Trusted Types.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-unsafe-cast-to-trusted-types",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
