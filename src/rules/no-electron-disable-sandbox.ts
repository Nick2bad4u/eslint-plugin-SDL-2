import type { TSESLint } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import { createElectronWebPreferencesBooleanListener } from "../_internal/electron-web-preferences.js";

type MessageIds = "default";

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
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
                "Disallow disabling Electron sandbox in webPreferences.",
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
