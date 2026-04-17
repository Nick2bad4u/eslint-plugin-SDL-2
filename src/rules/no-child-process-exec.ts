/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { isDefined, setHas } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getPropertyName,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

const CHILD_PROCESS_MODULE_NAMES = new Set([
    "child_process",
    "node:child_process",
]);
const DISALLOWED_CHILD_PROCESS_METHOD_NAMES = new Set(["exec", "execSync"]);

const isDisallowedChildProcessMethodName = (
    value: string | undefined
): value is "exec" | "execSync" =>
    isDefined(value) && setHas(DISALLOWED_CHILD_PROCESS_METHOD_NAMES, value);

const isChildProcessModuleSource = (value: string): boolean =>
    setHas(CHILD_PROCESS_MODULE_NAMES, value);

const isRequireCallFromChildProcess = (
    expression: null | TSESTree.Expression
): expression is TSESTree.CallExpression => {
    if (
        expression?.type !== "CallExpression" ||
        expression.callee.type !== "Identifier" ||
        expression.callee.name !== "require"
    ) {
        return false;
    }

    const [firstArgument] = expression.arguments;

    return (
        firstArgument !== undefined &&
        firstArgument.type !== "SpreadElement" &&
        firstArgument.type === "Literal" &&
        typeof firstArgument.value === "string" &&
        isChildProcessModuleSource(firstArgument.value)
    );
};

const getPatternIdentifier = (
    pattern: TSESTree.Property["value"]
): TSESTree.Identifier | undefined => {
    if (pattern.type === "Identifier") {
        return pattern;
    }

    if (
        pattern.type === "AssignmentPattern" &&
        pattern.left.type === "Identifier"
    ) {
        return pattern.left;
    }

    return undefined;
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        const childProcessExecBindingNames = new Set<string>();
        const childProcessNamespaceBindingNames = new Set<string>();

        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type === "Identifier") {
                    if (
                        !setHas(childProcessExecBindingNames, node.callee.name)
                    ) {
                        return;
                    }

                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });

                    return;
                }

                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                const methodName = getMemberPropertyName(node.callee);

                if (!isDisallowedChildProcessMethodName(methodName)) {
                    return;
                }

                if (
                    node.callee.object.type === "Identifier" &&
                    setHas(
                        childProcessNamespaceBindingNames,
                        node.callee.object.name
                    )
                ) {
                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });

                    return;
                }

                if (
                    node.callee.object.type === "CallExpression" &&
                    isRequireCallFromChildProcess(node.callee.object)
                ) {
                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });
                }
            },
            ImportDeclaration(node: TSESTree.ImportDeclaration) {
                if (!isChildProcessModuleSource(node.source.value)) {
                    return;
                }

                for (const specifierNode of node.specifiers) {
                    if (
                        specifierNode.type === "ImportDefaultSpecifier" ||
                        specifierNode.type === "ImportNamespaceSpecifier"
                    ) {
                        childProcessNamespaceBindingNames.add(
                            specifierNode.local.name
                        );
                        continue;
                    }

                    const importedName =
                        specifierNode.imported.type === "Identifier"
                            ? specifierNode.imported.name
                            : specifierNode.imported.value;

                    if (!isDisallowedChildProcessMethodName(importedName)) {
                        continue;
                    }

                    childProcessExecBindingNames.add(specifierNode.local.name);
                }
            },
            VariableDeclarator(node: TSESTree.VariableDeclarator) {
                if (!isRequireCallFromChildProcess(node.init)) {
                    return;
                }

                if (node.id.type === "Identifier") {
                    childProcessNamespaceBindingNames.add(node.id.name);
                    return;
                }

                if (node.id.type !== "ObjectPattern") {
                    return;
                }

                for (const propertyNode of node.id.properties) {
                    if (
                        propertyNode.type !== "Property" ||
                        propertyNode.computed
                    ) {
                        continue;
                    }

                    const importedName = getPropertyName(propertyNode);

                    if (!isDisallowedChildProcessMethodName(importedName)) {
                        continue;
                    }

                    const localIdentifier = getPatternIdentifier(
                        propertyNode.value
                    );

                    if (localIdentifier === undefined) {
                        continue;
                    }

                    childProcessExecBindingNames.add(localIdentifier.name);
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow child_process.exec() and execSync() shell-backed execution APIs.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-child-process-exec",
        },
        messages: {
            default:
                "Do not use child_process.exec() or execSync(); prefer execFile(), spawn(), or other argv-separated process launches.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-child-process-exec",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
