import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

type ElectronPreferenceMessageIds = "default";

type ElectronWebPreferenceCheck = Readonly<{
    disallowedValue: boolean;
    preferenceName: string;
}>;

type RuleContext = Readonly<
    TSESLint.RuleContext<ElectronPreferenceMessageIds, unknown[]>
>;

const getPropertyName = (
    property: Readonly<TSESTree.Property>
): string | undefined => {
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
    objectExpression: Readonly<TSESTree.ObjectExpression>,
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

const getBooleanLiteralValue = (
    valueNode: Readonly<TSESTree.Node>
): boolean | undefined => {
    if (valueNode.type !== "Literal" || typeof valueNode.value !== "boolean") {
        return undefined;
    }

    return valueNode.value;
};

/**
 * Creates a listener that reports unsafe boolean Electron `webPreferences`
 * values.
 */
export const createElectronWebPreferencesBooleanListener = (
    context: RuleContext,
    check: ElectronWebPreferenceCheck
): TSESLint.RuleListener => ({
    "NewExpression[callee.name=/^(?:BrowserWindow|BrowserView)$/]"(
        node: Readonly<TSESTree.NewExpression>
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

        const preferenceProperty = getPropertyByName(
            webPreferencesProperty.value,
            check.preferenceName
        );

        if (preferenceProperty === undefined) {
            return;
        }

        const preferenceValueNode = preferenceProperty.value;
        const literalValue = getBooleanLiteralValue(preferenceValueNode);

        if (literalValue !== check.disallowedValue) {
            return;
        }

        context.report({
            messageId: "default",
            node: preferenceProperty,
        });
    },
});
