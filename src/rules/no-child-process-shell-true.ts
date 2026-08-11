/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getMemberPropertyName = (
    memberExpression: TSESTree.MemberExpression
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === AST_NODE_TYPES.Identifier
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === AST_NODE_TYPES.Literal &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return undefined;
};

const isTruthyLiteral = (node: TSESTree.Property["value"]): boolean =>
    node.type === AST_NODE_TYPES.Literal && node.value === true;

const getPropertyKeyName = (
    propertyNode: TSESTree.Property
): string | undefined => {
    if (propertyNode.key.type === AST_NODE_TYPES.Identifier) {
        return propertyNode.key.name;
    }

    if (
        propertyNode.key.type === AST_NODE_TYPES.Literal &&
        typeof propertyNode.key.value === "string"
    ) {
        return propertyNode.key.value;
    }

    return undefined;
};

const hasShellTrueOption = (optionsNode: TSESTree.Expression): boolean => {
    if (optionsNode.type !== AST_NODE_TYPES.ObjectExpression) {
        return false;
    }

    return optionsNode.properties.some(
        (propertyNode) =>
            propertyNode.type === AST_NODE_TYPES.Property &&
            propertyNode.kind === "init" &&
            getPropertyKeyName(propertyNode) === "shell" &&
            isTruthyLiteral(propertyNode.value)
    );
};

const isTargetChildProcessMethod = (node: TSESTree.CallExpression): boolean => {
    if (node.callee.type === AST_NODE_TYPES.Identifier) {
        return node.callee.name === "spawn" || node.callee.name === "execFile";
    }

    if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    const methodName = getMemberPropertyName(node.callee);

    return methodName === "spawn" || methodName === "execFile";
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        const checkCallExpression = (node: TSESTree.CallExpression): void => {
            if (!isTargetChildProcessMethod(node)) {
                return;
            }

            for (const argumentNode of node.arguments) {
                if (
                    argumentNode.type !== AST_NODE_TYPES.SpreadElement &&
                    hasShellTrueOption(argumentNode)
                ) {
                    context.report({
                        messageId: "default",
                        node: argumentNode,
                    });
                }
            }
        };

        return {
            CallExpression: checkCallExpression,
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow child_process spawn/execFile options that enable shell: true.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-child-process-shell-true",
        },
        messages: {
            default:
                "Do not enable shell: true for child_process execution paths.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-child-process-shell-true",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
