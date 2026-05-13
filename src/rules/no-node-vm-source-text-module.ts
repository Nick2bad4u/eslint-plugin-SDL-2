/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { setHas } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getPropertyName,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

const VM_MODULE_NAMES = new Set(["node:vm", "vm"]);
const SOURCE_TEXT_MODULE_NAME = "SourceTextModule";

const isVmModuleSource = (value: string): boolean =>
    setHas(VM_MODULE_NAMES, value);

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

const isSourceTextModuleConstructor = (
    callee: Readonly<TSESTree.NewExpression["callee"]>,
    sourceTextModuleBindingNames: ReadonlySet<string>,
    vmNamespaceBindingNames: ReadonlySet<string>
): boolean => {
    if (callee.type === AST_NODE_TYPES.Identifier) {
        return setHas(sourceTextModuleBindingNames, callee.name);
    }

    if (callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    if (getMemberPropertyName(callee) !== SOURCE_TEXT_MODULE_NAME) {
        return false;
    }

    return (
        (callee.object.type === AST_NODE_TYPES.Identifier &&
            setHas(vmNamespaceBindingNames, callee.object.name)) ||
        (callee.object.type === AST_NODE_TYPES.CallExpression &&
            isRequireCallFromVmModule(callee.object))
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        const sourceTextModuleBindingNames = new Set<string>();
        const vmNamespaceBindingNames = new Set<string>();

        return {
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

                    if (importedName === SOURCE_TEXT_MODULE_NAME) {
                        sourceTextModuleBindingNames.add(
                            specifierNode.local.name
                        );
                    }
                }
            },
            NewExpression(node: TSESTree.NewExpression) {
                if (
                    !isSourceTextModuleConstructor(
                        node.callee,
                        sourceTextModuleBindingNames,
                        vmNamespaceBindingNames
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: node.callee,
                });
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

                    if (
                        getPropertyName(propertyNode) !==
                        SOURCE_TEXT_MODULE_NAME
                    ) {
                        continue;
                    }

                    const localIdentifier = getPatternIdentifier(
                        propertyNode.value
                    );

                    if (localIdentifier === undefined) {
                        continue;
                    }

                    sourceTextModuleBindingNames.add(localIdentifier.name);
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow node:vm SourceTextModule constructors that compile JavaScript source strings into executable modules.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-vm-source-text-module",
        },
        messages: {
            default:
                "Do not compile code with node:vm SourceTextModule; loading executable modules from source strings is not a security boundary.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-node-vm-source-text-module",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
