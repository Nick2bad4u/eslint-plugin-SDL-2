import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

/**
 * Get the static property name accessed by a member expression.
 *
 * Returns `undefined` for computed members whose property key cannot be
 * resolved to a static string.
 *
 * @param memberExpression - Member expression to inspect.
 *
 * @returns Static property name when available.
 */
export const getMemberPropertyName = (
    memberExpression: Readonly<TSESTree.MemberExpression>
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === "Identifier"
    ) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.property.type === "Literal" &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return undefined;
};

/**
 * Get the static key name for an object literal property.
 *
 * @param property - Object property node to inspect.
 *
 * @returns Static property key when available.
 */
export const getPropertyName = (
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

/**
 * Find an initialized object literal property by its static key name.
 *
 * @param objectExpression - Object expression to search.
 * @param propertyName - Property name to match.
 *
 * @returns Matching property node when present.
 */
export const getPropertyByName = (
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

/**
 * Resolve a string value from a static expression.
 *
 * Supports plain string literals and template literals without expressions.
 *
 * @param node - Expression node to inspect.
 *
 * @returns Static string value when available.
 */
export const getStaticStringValue = (
    node: Readonly<TSESTree.Expression>
): string | undefined => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
        return arrayFirst(node.quasis)?.value.cooked ?? undefined;
    }

    return undefined;
};

/**
 * Resolve a string value from a JSX attribute value.
 *
 * Supports plain string literals and JSX expression containers that wrap a
 * static string literal or expression-free template literal.
 *
 * @param attributeValue - JSX attribute value node to inspect.
 *
 * @returns Static string value when available.
 */
export const getStaticJsxAttributeStringValue = (
    attributeValue: Readonly<TSESTree.JSXAttribute["value"]>
): string | undefined => {
    if (attributeValue === null) {
        return undefined;
    }

    if (
        attributeValue.type === "Literal" &&
        typeof attributeValue.value === "string"
    ) {
        return attributeValue.value;
    }

    if (attributeValue.type !== "JSXExpressionContainer") {
        return undefined;
    }

    if (
        attributeValue.expression.type === "Literal" &&
        typeof attributeValue.expression.value === "string"
    ) {
        return attributeValue.expression.value;
    }

    if (
        attributeValue.expression.type === "TemplateLiteral" &&
        attributeValue.expression.expressions.length === 0
    ) {
        return (
            arrayFirst(attributeValue.expression.quasis)?.value.cooked ??
            undefined
        );
    }

    return undefined;
};
