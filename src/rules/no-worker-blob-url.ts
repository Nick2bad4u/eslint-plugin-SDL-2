/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { getStaticStringValue } from "../_internal/estree-utils.js";
import {
    isBlobUrl,
    isImportScriptsCall,
    isUrlCreateObjectUrlCall,
    isWorkerConstructor,
} from "../_internal/worker-code-loading.js";

type MessageIds = "default";

const isBlobBackedWorkerCodeExpression = (
    expression: Readonly<TSESTree.Expression>
): boolean => {
    const configuredValue = getStaticStringValue(expression);

    return (
        (typeof configuredValue === "string" && isBlobUrl(configuredValue)) ||
        isUrlCreateObjectUrlCall(expression)
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isImportScriptsCall(node.callee)) {
                    return;
                }

                for (const argumentNode of node.arguments) {
                    if (
                        argumentNode.type === "SpreadElement" ||
                        !isBlobBackedWorkerCodeExpression(argumentNode)
                    ) {
                        continue;
                    }

                    context.report({
                        messageId: "default",
                        node: argumentNode,
                    });
                }
            },
            NewExpression(node: TSESTree.NewExpression) {
                if (!isWorkerConstructor(node.callee)) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement" ||
                    !isBlobBackedWorkerCodeExpression(firstArgument)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: firstArgument,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow worker code-loading APIs that use blob: URLs or URL.createObjectURL(...) for executable scripts.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-worker-blob-url",
        },
        messages: {
            default:
                "Do not load worker code from a blob: URL or URL.createObjectURL(...); use a reviewed worker script resource instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-worker-blob-url",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
