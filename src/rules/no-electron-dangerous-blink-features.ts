import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";

type MessageIds = "default";

const getPropertyName = (property: TSESTree.Property): string | undefined => {
    if (property.computed) {
        return undefined;
    }

    if (property.key.type === "Identifier") {
        return property.key.name;
    }

    if (
        property.key.type === "Literal" &&
        typeof property.key.value === "string"
    ) {
        return property.key.value;
    }

    return undefined;
};

const getPropertyByName = (
    objectExpression: TSESTree.ObjectExpression,
    propertyName: string
): TSESTree.Property | undefined => {
    for (const propertyNode of objectExpression.properties) {
        if (propertyNode.type !== "Property" || propertyNode.kind !== "init") {
            continue;
        }

        if (getPropertyName(propertyNode) === propertyName) {
            return propertyNode;
        }
    }

    return undefined;
};

const getStaticStringValue = (node: TSESTree.Node): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
        return arrayFirst(node.quasis)?.value.cooked ?? undefined;
    }

    return undefined;
};

const isDangerousBlinkFeaturesValue = (node: TSESTree.Node): boolean => {
    const staticStringValue = getStaticStringValue(node);

    if (typeof staticStringValue !== "string") {
        return false;
    }

    return staticStringValue.trim().length > 0;
};

const rule: TSESLint.RuleModule<MessageIds, unknown[]> = createRule({
    create(context) {
        return {
            "NewExpression[callee.name=/^(?:BrowserWindow|BrowserView)$/]"(
                node: TSESTree.NewExpression
            ) {
                const [firstArgument] = node.arguments;

                if (firstArgument?.type !== "ObjectExpression") {
                    return;
                }

                const webPreferencesProperty = getPropertyByName(
                    firstArgument,
                    "webPreferences"
                );

                if (webPreferencesProperty?.value.type !== "ObjectExpression") {
                    return;
                }

                const enableBlinkFeaturesProperty = getPropertyByName(
                    webPreferencesProperty.value,
                    "enableBlinkFeatures"
                );

                if (enableBlinkFeaturesProperty === undefined) {
                    return;
                }

                if (
                    !isDangerousBlinkFeaturesValue(
                        enableBlinkFeaturesProperty.value
                    )
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: enableBlinkFeaturesProperty,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow enabling risky Blink runtime features through Electron webPreferences.enableBlinkFeatures.",
        },
        messages: {
            default:
                "Do not set webPreferences.enableBlinkFeatures to a non-empty value.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-dangerous-blink-features",
});

export default rule;
