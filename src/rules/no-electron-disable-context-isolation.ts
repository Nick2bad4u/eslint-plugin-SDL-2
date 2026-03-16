import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: false,
            preferenceName: "contextIsolation",
        });
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow disabling contextIsolation in Electron webPreferences.",
        },
        messages: {
            default: "Do not set webPreferences.contextIsolation to false.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-disable-context-isolation",
});

export default rule;
