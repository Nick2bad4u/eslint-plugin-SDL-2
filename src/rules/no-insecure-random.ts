/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { basename, parse } from "node:path";
import { arrayIncludes, isDefined } from "ts-extras";

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
    arrayIncludes(
        bannedRandomLibraries,
        value as (typeof bannedRandomLibraries)[number]
    );

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule({
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
                    : node.object.type === "Identifier" &&
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
                    : node.object.type === "Identifier" &&
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
                    sourceArgument.type !== "Literal" ||
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
                "disallow insecure pseudo-random APIs and known non-cryptographic random libraries for security-sensitive code.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-random",
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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
