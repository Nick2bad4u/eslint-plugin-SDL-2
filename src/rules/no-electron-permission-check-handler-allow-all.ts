/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESTree/ESLint callback parameter shapes are mutable in upstream types and cannot be represented as fully readonly without invasive casts. */
import type { TSESTree } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { createRule } from "../_internal/create-rule.js";
import { getMemberPropertyName } from "../_internal/estree-utils.js";

type MessageIds = "default";

const isFunctionExpression = (
    expression: TSESTree.CallExpressionArgument
): expression is
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression =>
    expression.type === "ArrowFunctionExpression" ||
    expression.type === "FunctionExpression";

const isBooleanTrueLiteral = (
    expression: null | TSESTree.Expression | undefined
): boolean => expression?.type === "Literal" && expression.value === true;

const isAllowAllPermissionCheckHandler = (
    callbackNode: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression
): boolean => {
    if (callbackNode.body.type !== "BlockStatement") {
        return isBooleanTrueLiteral(callbackNode.body);
    }

    if (callbackNode.body.body.length !== 1) {
        return false;
    }

    const onlyStatement = arrayFirst(callbackNode.body.body);

    return (
        onlyStatement?.type === "ReturnStatement" &&
        isBooleanTrueLiteral(onlyStatement.argument)
    );
};

/** Rule implementation. */
const rule: ReturnType<typeof createRule> = createRule<unknown[], MessageIds>({
    create(context) {
        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                if (
                    getMemberPropertyName(node.callee) !==
                    "setPermissionCheckHandler"
                ) {
                    return;
                }

                const [firstArgument] = node.arguments;

                if (
                    firstArgument === undefined ||
                    firstArgument.type === "SpreadElement" ||
                    !isFunctionExpression(firstArgument) ||
                    !isAllowAllPermissionCheckHandler(firstArgument)
                ) {
                    return;
                }

                context.report({
                    messageId: "default",
                    node: firstArgument,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow Electron permission check handlers that unconditionally allow every permission request.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-permission-check-handler-allow-all",
        },
        messages: {
            default:
                "Do not unconditionally return true from setPermissionCheckHandler callbacks.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-electron-permission-check-handler-allow-all",
});

export default rule;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Restore linting after rule implementation declarations. */
