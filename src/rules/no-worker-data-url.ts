/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { getStaticStringValue } from "../_internal/estree-utils.js";
import {
    isDataUrl,
    isImportScriptsCall,
    isWorkerConstructor,
} from "../_internal/worker-code-loading.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isImportScriptsCall(node.callee)) {
                    return;
                }

                for (const argumentNode of node.arguments) {
                    if (argumentNode.type === "SpreadElement") {
                        continue;
                    }

                    const configuredValue = getStaticStringValue(argumentNode);

                    if (
                        typeof configuredValue !== "string" ||
                        !isDataUrl(configuredValue)
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
                    firstArgument.type === "SpreadElement"
                ) {
                    return;
                }

                const configuredValue = getStaticStringValue(firstArgument);

                if (
                    typeof configuredValue !== "string" ||
                    !isDataUrl(configuredValue)
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
                "disallow worker code-loading APIs that use static data: URLs for executable scripts.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-worker-data-url",
        },
        messages: {
            default:
                "Do not load worker code from a data: URL; use a reviewed worker script resource instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-worker-data-url",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
