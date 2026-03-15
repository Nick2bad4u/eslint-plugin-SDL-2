import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        return {
            "NewExpression[callee.name=/^(?:BrowserWindow|BrowserView)$/] > ObjectExpression.arguments > Property.properties[key.name='webPreferences'] > ObjectExpression.value > Property.properties[key.name=/^(?:nodeIntegration|nodeIntegrationInWorker|nodeIntegrationInSubFrames)$/][value.value=true]"(
                node
            ) {
                context.report({
                    messageId: "default",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow enabling Electron Node.js integration in BrowserWindow/BrowserView webPreferences.",
        },
        messages: {
            default: "Do not enable Node.js integration for remote content.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-node-integration",
});

export default rule;
