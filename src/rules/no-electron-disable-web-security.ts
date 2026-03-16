import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
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
                "Disallow disabling webSecurity in Electron webPreferences.",
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
