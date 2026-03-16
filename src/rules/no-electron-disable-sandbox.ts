import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: false,
            preferenceName: "sandbox",
        });
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow disabling Electron sandbox in webPreferences.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-sandbox",
        },
        messages: {
            default: "Do not set webPreferences.sandbox to false.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-disable-sandbox",
});

export default rule;
