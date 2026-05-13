import type { TSESTree } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import path from "node:path";
import { arrayIncludes, isDefined, setHas } from "ts-extras";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

const bannedRandomLibraries = [
    "chance",
    "random-float",
    "random-int",
    "random-number",
    "random-seed",
    "unique-random",
] as const;
const bannedRandomLibrarySet = new Set(bannedRandomLibraries);

const isBannedRandomLibrary = (value: string): boolean =>
    setHas(bannedRandomLibrarySet, value);

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<[], "default">({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            "CallExpression > MemberExpression[property.name='pseudoRandomBytes']"(
                node: TSESTree.MemberExpression
            ) {
                const isUnsafe = isDefined(fullTypeChecker)
                    ? arrayIncludes(
                          ["any", "Crypto"],
                          getNodeTypeAsString(
                              fullTypeChecker,
                              node.object,
                              context
                          )
                      )
                    : node.object.type === AST_NODE_TYPES.Identifier &&
                      node.object.name === "crypto";

                if (!isUnsafe) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
            "CallExpression > MemberExpression[property.name='random']"(
                node: TSESTree.MemberExpression
            ) {
                const isUnsafe = isDefined(fullTypeChecker)
                    ? arrayIncludes(
                          ["any", "Math"],
                          getNodeTypeAsString(
                              fullTypeChecker,
                              node.object,
                              context
                          )
                      )
                    : node.object.type === AST_NODE_TYPES.Identifier &&
                      node.object.name === "Math";

                if (!isUnsafe) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
            "CallExpression[callee.name='require'][arguments.length=1]"(
                node: TSESTree.CallExpression
            ) {
                const [sourceArgument] = node.arguments;

                if (
                    !isDefined(sourceArgument) ||
                    sourceArgument.type !== AST_NODE_TYPES.Literal ||
                    typeof sourceArgument.value !== "string"
                ) {
                    return;
                }

                const requireName = path.parse(
                    path.basename(sourceArgument.value)
                ).name;

                if (!isBannedRandomLibrary(requireName)) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
            ImportDeclaration(node) {
                const sourceText = node.source.value;

                if (typeof sourceText !== "string") {
                    return;
                }

                if (!isBannedRandomLibrary(path.basename(sourceText))) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow insecure pseudo-random APIs and known non-cryptographic random libraries for security-sensitive code.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-insecure-random",
        },
        messages: {
            default:
                "Do not use pseudo-random generators for secrets such as tokens, keys, or passwords.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-insecure-random",
});

export default rule;
