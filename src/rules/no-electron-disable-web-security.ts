import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: false,
            preferenceName: "webSecurity",
        });
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow disabling webSecurity in Electron webPreferences.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-web-security",
        },
        messages: {
            default: "Do not set webPreferences.webSecurity to false.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-disable-web-security",
});

export default rule;
