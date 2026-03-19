/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { getStaticStringValue } from "../_internal/estree-utils.js";
import {
    isBlobUrl,
    isDataUrl,
    isUrlCreateObjectUrlCall,
} from "../_internal/worker-code-loading.js";

type MessageIds = "default";

const isJavaScriptUrl = (value: string): boolean =>
    /^\s*javascript\s*:/iu.test(value);

const isUnsafeDynamicImportSource = (
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
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            ImportExpression(node: TSESTree.ImportExpression) {
                if (!isUnsafeDynamicImportSource(node.source)) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: node.source,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow dynamic import() calls that load code from data:, blob:, javascript:, or direct URL.createObjectURL(...) URLs.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-dynamic-import-unsafe-url",
        },
        messages: {
            default:
                "Do not dynamically import code from data:, blob:, javascript:, or URL.createObjectURL(...) URLs.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-dynamic-import-unsafe-url",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
