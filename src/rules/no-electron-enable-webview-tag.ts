import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: true,
            preferenceName: "webviewTag",
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow enabling Electron webPreferences.webviewTag.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-enable-webview-tag",
        },
        fixable: "code",
        messages: {
            default: "Do not set webPreferences.webviewTag to true.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-enable-webview-tag",
});

export default rule;
