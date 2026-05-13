/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isDefined, setHas } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getPropertyName,
} from "../_internal/estree-utils.js";

type DisallowedVmCallName =
    | "compileFunction"
    | "runInContext"
    | "runInNewContext"
    | "runInThisContext";

type DisallowedVmConstructorName = "Script";

type MessageIds = "default";

const VM_MODULE_NAMES = new Set(["node:vm", "vm"]);
const DISALLOWED_VM_CALL_NAMES = new Set([
    "compileFunction",
    "runInContext",
    "runInNewContext",
    "runInThisContext",
]);
const DISALLOWED_VM_CONSTRUCTOR_NAMES = new Set(["Script"]);

const isVmModuleSource = (value: string): boolean =>
    setHas(VM_MODULE_NAMES, value);

const isDisallowedVmCallName = (
    value: string | undefined
): value is DisallowedVmCallName =>
    isDefined(value) && setHas(DISALLOWED_VM_CALL_NAMES, value);

const isDisallowedVmConstructorName = (
    value: string | undefined
): value is DisallowedVmConstructorName =>
    isDefined(value) && setHas(DISALLOWED_VM_CONSTRUCTOR_NAMES, value);

const isRequireCallFromVmModule = (
    expression: null | TSESTree.Expression
): expression is TSESTree.CallExpression => {
    if (
        expression?.type !== AST_NODE_TYPES.CallExpression ||
        expression.callee.type !== AST_NODE_TYPES.Identifier ||
        expression.callee.name !== "require"
    ) {
        return false;
    }

    const [firstArgument] = expression.arguments;

    return (
        firstArgument !== undefined &&
        firstArgument.type !== AST_NODE_TYPES.SpreadElement &&
        firstArgument.type === AST_NODE_TYPES.Literal &&
        typeof firstArgument.value === "string" &&
        isVmModuleSource(firstArgument.value)
    );
};

const getPatternIdentifier = (
    pattern: TSESTree.Property["value"]
): TSESTree.Identifier | undefined => {
    if (pattern.type === AST_NODE_TYPES.Identifier) {
        return pattern;
    }

    if (
        pattern.type === AST_NODE_TYPES.AssignmentPattern &&
        pattern.left.type === AST_NODE_TYPES.Identifier
    ) {
        return pattern.left;
    }

    return undefined;
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        const vmCallBindingNames = new Set<string>();
        const vmConstructorBindingNames = new Set<string>();
        const vmNamespaceBindingNames = new Set<string>();

        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type === AST_NODE_TYPES.Identifier) {
                    if (!setHas(vmCallBindingNames, node.callee.name)) {
                        return;
                    }

                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });

                    return;
                }

                if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
                    return;
                }

                const methodName = getMemberPropertyName(node.callee);

                if (!isDisallowedVmCallName(methodName)) {
                    return;
                }

                if (
                    node.callee.object.type === AST_NODE_TYPES.Identifier &&
                    setHas(vmNamespaceBindingNames, node.callee.object.name)
                ) {
                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });

                    return;
                }

                if (
                    node.callee.object.type === AST_NODE_TYPES.CallExpression &&
                    isRequireCallFromVmModule(node.callee.object)
                ) {
                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });
                }
            },
            ImportDeclaration(node: TSESTree.ImportDeclaration) {
                if (!isVmModuleSource(node.source.value)) {
                    return;
                }

                for (const specifierNode of node.specifiers) {
                    if (
                        specifierNode.type ===
                            AST_NODE_TYPES.ImportDefaultSpecifier ||
                        specifierNode.type ===
                            AST_NODE_TYPES.ImportNamespaceSpecifier
                    ) {
                        vmNamespaceBindingNames.add(specifierNode.local.name);
                        continue;
                    }

                    const importedName =
                        specifierNode.imported.type ===
                        AST_NODE_TYPES.Identifier
                            ? specifierNode.imported.name
                            : specifierNode.imported.value;

                    if (isDisallowedVmCallName(importedName)) {
                        vmCallBindingNames.add(specifierNode.local.name);
                        continue;
                    }

                    if (isDisallowedVmConstructorName(importedName)) {
                        vmConstructorBindingNames.add(specifierNode.local.name);
                    }
                }
            },
            NewExpression(node: TSESTree.NewExpression) {
                if (node.callee.type === AST_NODE_TYPES.Identifier) {
                    if (!setHas(vmConstructorBindingNames, node.callee.name)) {
                        return;
                    }

                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });

                    return;
                }

                if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
                    return;
                }

                const constructorName = getMemberPropertyName(node.callee);

                if (!isDisallowedVmConstructorName(constructorName)) {
                    return;
                }

                if (
                    node.callee.object.type === AST_NODE_TYPES.Identifier &&
                    setHas(vmNamespaceBindingNames, node.callee.object.name)
                ) {
                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });

                    return;
                }

                if (
                    node.callee.object.type === AST_NODE_TYPES.CallExpression &&
                    isRequireCallFromVmModule(node.callee.object)
                ) {
                    context.report({
                        messageId: "default",
                        node: node.callee,
                    });
                }
            },
            VariableDeclarator(node: TSESTree.VariableDeclarator) {
                if (!isRequireCallFromVmModule(node.init)) {
                    return;
                }

                if (node.id.type === AST_NODE_TYPES.Identifier) {
                    vmNamespaceBindingNames.add(node.id.name);
                    return;
                }

                if (node.id.type !== AST_NODE_TYPES.ObjectPattern) {
                    return;
                }

                for (const propertyNode of node.id.properties) {
                    if (
                        propertyNode.type !== AST_NODE_TYPES.Property ||
                        propertyNode.computed
                    ) {
                        continue;
                    }

                    const importedName = getPropertyName(propertyNode);
                    const localIdentifier = getPatternIdentifier(
                        propertyNode.value
                    );

                    if (localIdentifier === undefined) {
                        continue;
                    }

                    if (isDisallowedVmCallName(importedName)) {
                        vmCallBindingNames.add(localIdentifier.name);
                        continue;
                    }

                    if (isDisallowedVmConstructorName(importedName)) {
                        vmConstructorBindingNames.add(localIdentifier.name);
                    }
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow node:vm dynamic code execution APIs that are commonly mistaken for a security sandbox.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-vm-run-in-context",
        },
        messages: {
            default:
                "Do not execute dynamic code through node:vm run/compile APIs; the vm module is not a security boundary.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-node-vm-run-in-context",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
