import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return createElectronWebPreferencesBooleanListener(context, {
            disallowedValue: true,
            preferenceName: "enableRemoteModule",
        });
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow enabling enableRemoteModule in Electron webPreferences.",
        },
        messages: {
            default: "Do not set webPreferences.enableRemoteModule to true.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-enable-remote-module",
});

export default rule;
