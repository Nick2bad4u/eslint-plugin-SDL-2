import { createRule } from "../_internal/create-rule.js";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
    create(context) {
        return {
            "NewExpression[callee.name=/^(?:BrowserWindow|BrowserView)$/] > ObjectExpression.arguments > Property.properties[key.name='webPreferences'] > ObjectExpression.value > Property.properties[key.name=/^(?:nodeIntegration|nodeIntegrationInWorker|nodeIntegrationInSubFrames)$/][value.value=true]"(
                node
            ) {
                context.report({
                    fix(fixer) {
                        const propertyText = context.sourceCode.getText(node);
                        const separatorIndex = propertyText.indexOf(":");

                        if (separatorIndex === -1) {
                            return null;
                        }

                        const valuePortion = propertyText.slice(
                            separatorIndex + 1
                        );
                        const trimmedValuePortion = valuePortion.trimStart();

                        if (!trimmedValuePortion.startsWith("true")) {
                            return null;
                        }

                        const leadingWhitespaceLength =
                            valuePortion.length - trimmedValuePortion.length;
                        const nextValuePortion = `${valuePortion.slice(0, leadingWhitespaceLength)}false${trimmedValuePortion.slice("true".length)}`;
                        const nextPropertyText = `${propertyText.slice(0, separatorIndex + 1)}${nextValuePortion}`;

                        if (nextPropertyText === propertyText) {
                            return null;
                        }

                        return fixer.replaceText(node, nextPropertyText);
                    },
                    messageId: "default",
                    node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow enabling Electron Node.js integration in BrowserWindow/BrowserView webPreferences.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-node-integration",
        },
        fixable: "code",
        messages: {
            default: "Do not enable Node.js integration for remote content.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-node-integration",
});

export default rule;
