import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { getStaticStringValue } from "../_internal/estree-utils.js";
import {
    isBlobUrl,
    isDataUrl,
    isServiceWorkerRegisterCall,
    isUrlCreateObjectUrlCall,
} from "../_internal/worker-code-loading.js";

type MessageIds = "default";

const isJavaScriptUrl = (value: string): boolean =>
    /^\s*javascript\s*:/iu.test(value);

const isUnsafeServiceWorkerScriptUrl = (
    expression: Readonly<TSESTree.Expression>
): boolean => {
    const configuredValue = getStaticStringValue(expression);

    return (
        (typeof configuredValue === "string" &&
            (isBlobUrl(configuredValue) ||
                isDataUrl(configuredValue) ||
                isJavaScriptUrl(configuredValue))) ||
        isUrlCreateObjectUrlCall(expression)
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isServiceWorkerRegisterCall(node.callee)) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement" ||
                    !isUnsafeServiceWorkerScriptUrl(firstArgument)
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
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow unsafe service worker script URLs such as data:, blob:, javascript:, and direct URL.createObjectURL(...) registrations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-service-worker-unsafe-script-url",
        },
        messages: {
            default:
                "Do not register a service worker from data:, blob:, javascript:, or URL.createObjectURL(...) script URLs.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-service-worker-unsafe-script-url",
});

export default rule;
