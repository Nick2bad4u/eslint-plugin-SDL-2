/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst, isDefined, setHas } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getPropertyName,
} from "../_internal/estree-utils.js";

type MessageIds = "default";

type PolicyFactoryFunction =
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression;

const isExpressionNode = (node: TSESTree.Node): node is TSESTree.Expression =>
    node.type !== "ArrayPattern" &&
    node.type !== "AssignmentPattern" &&
    node.type !== "ObjectPattern";

const POLICY_FACTORY_NAMES = new Set([
    "createHTML",
    "createScript",
    "createScriptURL",
]);

const isFunctionExpression = (
    expression: TSESTree.Expression
): expression is PolicyFactoryFunction =>
    expression.type === "ArrowFunctionExpression" ||
    expression.type === "FunctionExpression";

const unwrapTransparentExpression = (
    expression: TSESTree.Expression
): TSESTree.Expression => {
    if (
        expression.type === "TSAsExpression" ||
        expression.type === "TSTypeAssertion"
    ) {
        return unwrapTransparentExpression(expression.expression);
    }

    return expression;
};

const isPassThroughFactory = (factoryNode: PolicyFactoryFunction): boolean => {
    const [firstParameter] = factoryNode.params;

    if (firstParameter?.type !== "Identifier") {
        return false;
    }

    if (factoryNode.body.type !== "BlockStatement") {
        const expressionBody = unwrapTransparentExpression(factoryNode.body);

        return (
            expressionBody.type === "Identifier" &&
            expressionBody.name === firstParameter.name
        );
    }

    if (factoryNode.body.body.length !== 1) {
        return false;
    }

    const onlyStatement = arrayFirst(factoryNode.body.body);

    if (
        onlyStatement?.type !== "ReturnStatement" ||
        onlyStatement.argument === null
    ) {
        return false;
    }

    const returnedExpression = unwrapTransparentExpression(
        onlyStatement.argument
    );

    return (
        returnedExpression.type === "Identifier" &&
        returnedExpression.name === firstParameter.name
    );
};

const isTrustedTypesCreatePolicyCall = (
    node: TSESTree.CallExpression
): boolean => {
    if (node.callee.type !== "MemberExpression") {
        return false;
    }

    if (getMemberPropertyName(node.callee) !== "createPolicy") {
        return false;
    }

    if (node.callee.object.type === "Identifier") {
        return node.callee.object.name === "trustedTypes";
    }

    if (node.callee.object.type !== "MemberExpression") {
        return false;
    }

    return getMemberPropertyName(node.callee.object) === "trustedTypes";
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (!isTrustedTypesCreatePolicyCall(node)) {
                    return;
                }

                const [, secondArgument] = node.arguments;

                if (
                    secondArgument === undefined ||
                    secondArgument.type === "SpreadElement" ||
                    secondArgument.type !== "ObjectExpression"
                ) {
                    return;
                }

                for (const propertyNode of secondArgument.properties) {
                    if (
                        propertyNode.type !== "Property" ||
                        propertyNode.kind !== "init"
                    ) {
                        continue;
                    }

                    const propertyName = getPropertyName(propertyNode);

                    if (
                        !isDefined(propertyName) ||
                        !setHas(POLICY_FACTORY_NAMES, propertyName) ||
                        !isExpressionNode(propertyNode.value) ||
                        !isFunctionExpression(propertyNode.value) ||
                        !isPassThroughFactory(propertyNode.value)
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            methodName: propertyName,
                        },
                        messageId: "default",
                        node: propertyNode,
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
                "disallow pass-through Trusted Types policies that return unvalidated input unchanged.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-trusted-types-policy-pass-through",
        },
        messages: {
            default:
                "Do not implement {{methodName}} as a Trusted Types pass-through; sanitize or validate the input first.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-trusted-types-policy-pass-through",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
