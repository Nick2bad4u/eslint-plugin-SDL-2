import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: true,
            preferenceName: "allowRunningInsecureContent",
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow enabling allowRunningInsecureContent in Electron webPreferences.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-allow-running-insecure-content",
        },
        fixable: "code",
        messages: {
            default:
                "Do not set webPreferences.allowRunningInsecureContent to true.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-allow-running-insecure-content",
});

export default rule;
