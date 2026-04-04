/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { setHas } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getPropertyName,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

const WORKER_THREADS_MODULE_NAMES = new Set([
    "node:worker_threads",
    "worker_threads",
]);

const isWorkerThreadsModuleSource = (value: string): boolean =>
    setHas(WORKER_THREADS_MODULE_NAMES, value);

const isRequireCallFromWorkerThreads = (
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
        isWorkerThreadsModuleSource(firstArgument.value)
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

const hasEvalTrueOption = (
    optionsNode: Readonly<TSESTree.Expression>
): boolean => {
    if (optionsNode.type !== "ObjectExpression") {
        return false;
    }

    for (const propertyNode of optionsNode.properties) {
        if (propertyNode.type !== "Property" || propertyNode.kind !== "init") {
            continue;
        }

        if (getPropertyName(propertyNode) !== "eval") {
            continue;
        }

        if (
            propertyNode.value.type === "Literal" &&
            propertyNode.value.value === true
        ) {
            return true;
        }
    }

    return false;
};

const isWorkerThreadsWorkerConstructor = (
    callee: Readonly<TSESTree.NewExpression["callee"]>,
    workerBindingNames: ReadonlySet<string>,
    workerThreadsNamespaceBindingNames: ReadonlySet<string>
): boolean => {
    if (callee.type === "Identifier") {
        return setHas(workerBindingNames, callee.name);
    }

    if (callee.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(callee) !== "Worker") {
        return false;
    }

    return (
        (callee.object.type === "Identifier" &&
            setHas(workerThreadsNamespaceBindingNames, callee.object.name)) ||
        (callee.object.type === "CallExpression" &&
            isRequireCallFromWorkerThreads(callee.object))
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        const workerBindingNames = new Set<string>();
        const workerThreadsNamespaceBindingNames = new Set<string>();

        return {
            ImportDeclaration(node: TSESTree.ImportDeclaration) {
                if (!isWorkerThreadsModuleSource(node.source.value)) {
                    return;
                }

                for (const specifierNode of node.specifiers) {
                    if (
                        specifierNode.type === "ImportDefaultSpecifier" ||
                        specifierNode.type === "ImportNamespaceSpecifier"
                    ) {
                        workerThreadsNamespaceBindingNames.add(
                            specifierNode.local.name
                        );
                        continue;
                    }

                    const importedName =
                        specifierNode.imported.type === "Identifier"
                            ? specifierNode.imported.name
                            : specifierNode.imported.value;

                    if (importedName === "Worker") {
                        workerBindingNames.add(specifierNode.local.name);
                    }
                }
            },
            NewExpression(node: TSESTree.NewExpression) {
                if (
                    !isWorkerThreadsWorkerConstructor(
                        node.callee,
                        workerBindingNames,
                        workerThreadsNamespaceBindingNames
                    )
                ) {
                    return;
                }

                const [, secondArgument] = node.arguments;

                if (
                    secondArgument === undefined ||
                    secondArgument.type === "SpreadElement" ||
                    !hasEvalTrueOption(secondArgument)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: secondArgument,
                });
            },
            VariableDeclarator(node: TSESTree.VariableDeclarator) {
                if (!isRequireCallFromWorkerThreads(node.init)) {
                    return;
                }

                if (node.id.type === "Identifier") {
                    workerThreadsNamespaceBindingNames.add(node.id.name);
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

                    if (getPropertyName(propertyNode) !== "Worker") {
                        continue;
                    }

                    const localIdentifier = getPatternIdentifier(
                        propertyNode.value
                    );

                    if (localIdentifier === undefined) {
                        continue;
                    }

                    workerBindingNames.add(localIdentifier.name);
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow node:worker_threads Worker options that enable eval: true string execution.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-worker-threads-eval",
        },
        messages: {
            default:
                "Do not enable eval: true for node:worker_threads Worker instances; prefer reviewed worker script files instead of string-backed execution.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-node-worker-threads-eval",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
