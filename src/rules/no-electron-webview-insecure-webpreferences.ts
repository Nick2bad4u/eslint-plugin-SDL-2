/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayJoin, isEmpty } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import { getStaticJsxAttributeStringValue } from "../_internal/estree-utils.js";

type MessageIds = "default";

const UNSAFE_WEBPREFERENCES_PATTERNS = [
    {
        flagName: "allowRunningInsecureContent",
        pattern: /\ballowrunninginsecurecontent\s*=\s*(?:1|on|true|yes)\b/iu,
    },
    {
        flagName: "contextIsolation",
        pattern: /\bcontextisolation\s*=\s*(?:0|false|no|off)\b/iu,
    },
    {
        flagName: "experimentalFeatures",
        pattern: /\bexperimentalfeatures\s*=\s*(?:1|on|true|yes)\b/iu,
    },
    {
        flagName: "sandbox",
        pattern: /\bsandbox\s*=\s*(?:0|false|no|off)\b/iu,
    },
    {
        flagName: "webSecurity",
        pattern: /\bwebsecurity\s*=\s*(?:0|false|no|off)\b/iu,
    },
] as const;

const isJsxWebviewElement = (node: TSESTree.JSXOpeningElement): boolean =>
    node.name.type === "JSXIdentifier" &&
    node.name.name.toLowerCase() === "webview";

const getJsxAttributeName = (attributeNode: TSESTree.JSXAttribute): string => {
    if (attributeNode.name.type === "JSXIdentifier") {
        return attributeNode.name.name.toLowerCase();
    }

    return `${attributeNode.name.namespace.name}:${attributeNode.name.name.name}`.toLowerCase();
};

const getUnsafeWebPreferencesFlags = (
    attributeValue: string
): readonly string[] =>
    UNSAFE_WEBPREFERENCES_PATTERNS.flatMap(({ flagName, pattern }) =>
        pattern.test(attributeValue) ? [flagName] : []
    );

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
                if (!isJsxWebviewElement(node)) {
                    return;
                }

                for (const attributeNode of node.attributes) {
                    if (attributeNode.type !== "JSXAttribute") {
                        continue;
                    }

                    if (
                        getJsxAttributeName(attributeNode) !== "webpreferences"
                    ) {
                        continue;
                    }

                    const staticValue = getStaticJsxAttributeStringValue(
                        attributeNode.value
                    );

                    if (typeof staticValue !== "string") {
                        continue;
                    }

                    const unsafeFlags =
                        getUnsafeWebPreferencesFlags(staticValue);

                    if (isEmpty(unsafeFlags)) {
                        continue;
                    }

                    context.report({
                        data: {
                            flags: arrayJoin(unsafeFlags, ", "),
                        },
                        messageId: "default",
                        node: attributeNode,
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow unsafe Electron webview webpreferences string flags.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-webview-insecure-webpreferences",
        },
        messages: {
            default:
                "Do not enable unsafe Electron webview webpreferences flags: {{flags}}.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-webview-insecure-webpreferences",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
