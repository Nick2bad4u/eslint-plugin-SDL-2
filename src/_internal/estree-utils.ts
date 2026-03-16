import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

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
