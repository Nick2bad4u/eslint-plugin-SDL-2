import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { basename, parse } from "node:path";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
} from "../_internal/ast-utils.js";
import { createRule } from "../_internal/create-rule.js";

const bannedRandomLibraries = [
    "chance",
    "random-number",
    "random-int",
    "random-float",
    "random-seed",
    "unique-random",
] as const;

const isBannedRandomLibrary = (value: string): boolean =>
    bannedRandomLibraries.includes(
        value as (typeof bannedRandomLibraries)[number]
    );

const rule: TSESLint.RuleModule<string, unknown[]> = createRule({
    create(context) {
        const fullTypeChecker = getFullTypeChecker(context);

        return {
            "CallExpression > MemberExpression[property.name='pseudoRandomBytes']"(
                node: TSESTree.MemberExpression
            ) {
                const isUnsafe =
                    fullTypeChecker === undefined
                        ? node.object.type === "Identifier" &&
                          node.object.name === "crypto"
                        : ["any", "Crypto"].includes(
                              getNodeTypeAsString(
                                  fullTypeChecker,
                                  node.object,
                                  context
                              )
                          );

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
                const isUnsafe =
                    fullTypeChecker === undefined
                        ? node.object.type === "Identifier" &&
                          node.object.name === "Math"
                        : ["any", "Math"].includes(
                              getNodeTypeAsString(
                                  fullTypeChecker,
                                  node.object,
                                  context
                              )
                          );

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
                    sourceArgument?.type !== "Literal" ||
                    typeof sourceArgument.value !== "string"
                ) {
                    return;
                }

                const requireName = parse(basename(sourceArgument.value)).name;

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

                if (!isBannedRandomLibrary(basename(sourceText))) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "Disallow insecure pseudo-random APIs and known non-cryptographic random libraries for security-sensitive code.",
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
