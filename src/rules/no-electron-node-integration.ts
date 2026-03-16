import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
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
                "disallow enabling Electron Node.js integration in BrowserWindow/BrowserView webPreferences.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-node-integration",
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
