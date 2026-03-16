import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: false,
            preferenceName: "contextIsolation",
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow disabling contextIsolation in Electron webPreferences.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-context-isolation",
        },
        fixable: "code",
        messages: {
            default: "Do not set webPreferences.contextIsolation to false.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-disable-context-isolation",
});

export default rule;
