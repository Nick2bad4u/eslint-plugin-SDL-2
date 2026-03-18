/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { isDefined, setHas } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import {
    getMemberPropertyName,
    getPropertyName,
    getStaticStringValue,
} from "../_internal/estree-utils.js";
import {
    isNodeTlsStaticMember,
    isRelevantNodeTlsOptionsObject,
} from "../_internal/node-tls-config.js";

type LegacyTlsPropertyName = "maxVersion" | "minVersion" | "secureProtocol";
type MessageIds = "default";

const LEGACY_TLS_VERSION_VALUES = new Set([
    "TLSv1",
    "TLSv1.0",
    "TLSv1.1",
]);

const isLegacySecureProtocolValue = (value: string): boolean =>
    /^(?:SSLv2|SSLv3|TLSv1(?:_1)?)(?:_(?:client|server))?_method$/u.test(value);

const isExpressionNode = (node: TSESTree.Node): node is TSESTree.Expression =>
    node.type !== "ArrayPattern" &&
    node.type !== "AssignmentPattern" &&
    node.type !== "ObjectPattern";

const isLegacyTlsPropertyValue = (
    propertyName: LegacyTlsPropertyName,
    configuredValue: string
): boolean => {
    if (propertyName === "secureProtocol") {
        return isLegacySecureProtocolValue(configuredValue);
    }

    return setHas(LEGACY_TLS_VERSION_VALUES, configuredValue);
};

const getLegacyTlsPropertyName = (
    propertyNode: TSESTree.Property
): LegacyTlsPropertyName | undefined => {
    const propertyName = getPropertyName(propertyNode);

    if (
        propertyName === "maxVersion" ||
        propertyName === "minVersion" ||
        propertyName === "secureProtocol"
    ) {
        return propertyName;
    }

    return undefined;
};

const isTlsDefaultVersionMember = (
    node: TSESTree.AssignmentExpression["left"]
): node is TSESTree.MemberExpression =>
    isNodeTlsStaticMember(
        node,
        new Set(["DEFAULT_MAX_VERSION", "DEFAULT_MIN_VERSION"])
    );

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            AssignmentExpression(node: TSESTree.AssignmentExpression) {
                if (
                    node.operator !== "=" ||
                    !isTlsDefaultVersionMember(node.left)
                ) {
                    return;
                }

                const configuredValue = getStaticStringValue(node.right);

                if (
                    typeof configuredValue !== "string" ||
                    !setHas(LEGACY_TLS_VERSION_VALUES, configuredValue)
                ) {
                    return;
                }

                context.report({
                    data: {
                        configuredValue,
                        propertyName:
                            getMemberPropertyName(node.left) ??
                            "DEFAULT_MIN_VERSION",
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
                        propertyNode.kind !== "init"
                    ) {
                        continue;
                    }

                    if (!isExpressionNode(propertyNode.value)) {
                        continue;
                    }

                    const propertyName = getLegacyTlsPropertyName(propertyNode);

                    if (!isDefined(propertyName)) {
                        continue;
                    }

                    const configuredValue = getStaticStringValue(
                        propertyNode.value
                    );

                    if (
                        typeof configuredValue !== "string" ||
                        !isLegacyTlsPropertyValue(propertyName, configuredValue)
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            configuredValue,
                            propertyName,
                        },
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
                "disallow legacy TLS protocol selection such as TLSv1/TLSv1.1 in Node.js TLS and HTTPS configuration.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-node-tls-legacy-protocol",
        },
        messages: {
            default:
                "Do not configure {{propertyName}} with legacy TLS protocol {{configuredValue}}; require TLSv1.2 or newer instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-node-tls-legacy-protocol",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
