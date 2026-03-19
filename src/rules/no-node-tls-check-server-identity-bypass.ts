/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import { getPropertyName } from "../_internal/estree-utils.js";
import {
    isNodeTlsStaticMember,
    isRelevantNodeTlsOptionsObject,
} from "../_internal/node-tls-config.js";

type CheckServerIdentityFunction =
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression;

type MessageIds = "default";

const CHECK_SERVER_IDENTITY_PROPERTY_NAMES = new Set(["checkServerIdentity"]);

const isFunctionExpression = (
    expression: TSESTree.Expression
): expression is CheckServerIdentityFunction =>
    expression.type === "ArrowFunctionExpression" ||
    expression.type === "FunctionExpression";

const isExpressionNode = (node: TSESTree.Node): node is TSESTree.Expression =>
    node.type !== "ArrayPattern" &&
    node.type !== "AssignmentPattern" &&
    node.type !== "ObjectPattern";

const isAlwaysSuccessfulReturnExpression = (
    expression: TSESTree.Expression
): boolean => {
    if (expression.type === "Identifier") {
        return expression.name === "undefined";
    }

    if (expression.type === "Literal") {
        return expression.value === null;
    }

    return (
        expression.type === "UnaryExpression" && expression.operator === "void"
    );
};

const isAlwaysSuccessfulCheckServerIdentity = (
    callbackNode: CheckServerIdentityFunction
): boolean => {
    if (callbackNode.body.type !== "BlockStatement") {
        return isAlwaysSuccessfulReturnExpression(callbackNode.body);
    }

    if (callbackNode.body.body.length === 0) {
        return true;
    }

    if (callbackNode.body.body.length !== 1) {
        return false;
    }

    const onlyStatement = arrayFirst(callbackNode.body.body);

    if (onlyStatement?.type !== "ReturnStatement") {
        return false;
    }

    return (
        onlyStatement.argument === null ||
        (onlyStatement.argument !== null &&
            isAlwaysSuccessfulReturnExpression(onlyStatement.argument))
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (
                    node.operator !== "=" ||
                    !isNodeTlsStaticMember(
                        node.left,
                        CHECK_SERVER_IDENTITY_PROPERTY_NAMES
                    ) ||
                    !isFunctionExpression(node.right) ||
                    !isAlwaysSuccessfulCheckServerIdentity(node.right)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: node.right,
                });
            },
            ObjectExpression(node: TSESTree.ObjectExpression) {
                if (!isRelevantNodeTlsOptionsObject(node)) {
                    return;
                }

                for (const propertyNode of node.properties) {
                    if (
                        propertyNode.type !== "Property" ||
                        propertyNode.kind !== "init" ||
                        getPropertyName(propertyNode) !==
                            "checkServerIdentity" ||
                        !isExpressionNode(propertyNode.value) ||
                        !isFunctionExpression(propertyNode.value) ||
                        !isAlwaysSuccessfulCheckServerIdentity(
                            propertyNode.value
                        )
                    ) {
                        continue;
                    }

                    context.report({
                        messageId: "default",
                        node: propertyNode.value,
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
                "disallow Node.js checkServerIdentity overrides that always accept the peer hostname.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-tls-check-server-identity-bypass",
        },
        messages: {
            default:
                "Do not bypass Node.js hostname verification with a checkServerIdentity implementation that always succeeds.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-node-tls-check-server-identity-bypass",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
