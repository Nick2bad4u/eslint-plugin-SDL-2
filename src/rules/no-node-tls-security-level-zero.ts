/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../_internal/create-rule.js";
import {
    getPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";
import {
    isNodeTlsStaticMember,
    isRelevantNodeTlsOptionsObject,
} from "../_internal/node-tls-config.js";

type MessageIds = "default";

const TLS_DEFAULT_CIPHERS_PROPERTY_NAMES = new Set(["DEFAULT_CIPHERS"]);
const TLS_SECURITY_LEVEL_ZERO_PATTERN = /@seclevel\s*=\s*0\b/iu;

const isExpressionNode = (node: TSESTree.Node): node is TSESTree.Expression =>
    node.type !== "ArrayPattern" &&
    node.type !== "AssignmentPattern" &&
    node.type !== "ObjectPattern";

const isSecurityLevelZeroCipherString = (value: string): boolean =>
    TLS_SECURITY_LEVEL_ZERO_PATTERN.test(value);

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], MessageIds>({
    create(context) {
        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (
                    node.operator !== "=" ||
                    !isNodeTlsStaticMember(
                        node.left,
                        TLS_DEFAULT_CIPHERS_PROPERTY_NAMES
                    )
                ) {
                    return;
                }

                const configuredValue = getStaticStringValue(node.right);

                if (
                    typeof configuredValue !== "string" ||
                    !isSecurityLevelZeroCipherString(configuredValue)
                ) {
                    return;
                }

                context.report({
                    data: {
                        configuredValue,
                        propertyName: "DEFAULT_CIPHERS",
                    },
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
                        getPropertyName(propertyNode) !== "ciphers" ||
                        !isExpressionNode(propertyNode.value)
                    ) {
                        continue;
                    }

                    const configuredValue = getStaticStringValue(
                        propertyNode.value
                    );

                    if (
                        typeof configuredValue !== "string" ||
                        !isSecurityLevelZeroCipherString(configuredValue)
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            configuredValue,
                            propertyName: "ciphers",
                        },
                        messageId: "default",
                        node: propertyNode.value,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow lowering Node.js TLS cipher security to OpenSSL security level 0.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-tls-security-level-zero",
        },
        messages: {
            default:
                "Do not lower TLS cipher security with {{propertyName}}={{configuredValue}}; keep Node's default security level or use a reviewed stronger cipher policy instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-node-tls-security-level-zero",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
