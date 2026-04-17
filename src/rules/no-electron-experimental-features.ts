import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: true,
            preferenceName: "experimentalFeatures",
        });
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow enabling Electron webPreferences.experimentalFeatures.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-experimental-features",
        },
        fixable: "code",
        messages: {
            default: "Do not set webPreferences.experimentalFeatures to true.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-experimental-features",
});

export default rule;
