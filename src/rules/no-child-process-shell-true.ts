/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

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

const isTruthyLiteral = (node: TSESTree.Property["value"]): boolean =>
    node.type === "Literal" && node.value === true;

const hasShellTrueOption = (optionsNode: TSESTree.Expression): boolean => {
    if (optionsNode.type !== "ObjectExpression") {
        return false;
    }

    for (const propertyNode of optionsNode.properties) {
        if (propertyNode.type !== "Property" || propertyNode.kind !== "init") {
            continue;
        }

        const keyName =
            propertyNode.key.type === "Identifier"
                ? propertyNode.key.name
                : propertyNode.key.type === "Literal" &&
                    typeof propertyNode.key.value === "string"
                  ? propertyNode.key.value
                  : undefined;

        if (keyName !== "shell") {
            continue;
        }

        if (isTruthyLiteral(propertyNode.value)) {
            return true;
        }
    }

    return false;
};

const isTargetChildProcessMethod = (node: TSESTree.CallExpression): boolean => {
    if (node.callee.type === "Identifier") {
        return node.callee.name === "spawn" || node.callee.name === "execFile";
    }

    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    const methodName = getMemberPropertyName(node.callee);

    return methodName === "spawn" || methodName === "execFile";
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isTargetChildProcessMethod(node)) {
                    return;
                }

                for (const argumentNode of node.arguments) {
                    if (argumentNode.type === "SpreadElement") {
                        continue;
                    }

                    if (!hasShellTrueOption(argumentNode)) {
                        continue;
                    }

                    context.report({
                        messageId: "default",
                        node: argumentNode,
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow child_process spawn/execFile options that enable shell: true.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-child-process-shell-true",
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
