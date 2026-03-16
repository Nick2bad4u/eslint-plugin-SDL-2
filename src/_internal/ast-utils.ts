import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { UnknownMap } from "type-fest";
import type ts from "typescript";

import { isDefined, safeCastTo } from "ts-extras";

type RuleContext = Readonly<TSESLint.RuleContext<string, unknown[]>>;

type TypeScriptParserServices = Readonly<{
    esTreeNodeToTSNodeMap: ReadonlyMap<TSESTree.Node, ts.Node>;
    program: ts.Program;
    tsNodeToESTreeNodeMap: ReadonlyMap<ts.Node, TSESTree.Node>;
}>;

const isMapLike = (value: unknown): value is Readonly<UnknownMap> =>
    typeof value === "object" &&
    value !== null &&
    typeof safeCastTo<{ get?: unknown }>(value).get === "function";

const isProgramLike = (value: unknown): value is ts.Program =>
    typeof value === "object" &&
    value !== null &&
    typeof safeCastTo<{ getTypeChecker?: unknown }>(value).getTypeChecker ===
        "function";

const isTypeScriptParserServices = (
    parserServices: unknown
): parserServices is TypeScriptParserServices => {
    if (typeof parserServices !== "object" || parserServices === null) {
        return false;
    }

    const candidate =
        safeCastTo<Partial<TypeScriptParserServices>>(parserServices);

    return (
        isProgramLike(candidate.program) &&
        isMapLike(candidate.esTreeNodeToTSNodeMap) &&
        isMapLike(candidate.tsNodeToESTreeNodeMap)
    );
};

const getParserServices = (
    context: RuleContext
): TypeScriptParserServices | undefined => {
    const parserServices = context.sourceCode.parserServices;

    return isTypeScriptParserServices(parserServices)
        ? parserServices
        : undefined;
};

/** Returns `true` when parser services expose complete TypeScript program data. */
export const hasFullTypeInformation = (context: RuleContext): boolean =>
    isDefined(getParserServices(context));

/** Returns the TypeScript type checker when parser services are available. */
export const getFullTypeChecker = (
    context: RuleContext
): ts.TypeChecker | undefined =>
    getParserServices(context)?.program.getTypeChecker();

/** Resolve the textual type for an ESTree node via parser services. */
export const getNodeTypeAsString = (
    fullTypeChecker: Readonly<ts.TypeChecker> | undefined,
    node: null | Readonly<TSESTree.Node> | undefined,
    context: RuleContext
): string => {
    if (!isDefined(fullTypeChecker) || node === null || node === undefined) {
        return "any";
    }

    const parserServices = getParserServices(context);

    if (!isDefined(parserServices)) {
        return "any";
    }

    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(
        safeCastTo<TSESTree.Node>(node)
    );

    if (!isDefined(tsNode)) {
        return "any";
    }

    const tsType = fullTypeChecker.getTypeAtLocation(
        safeCastTo<ts.Node>(tsNode)
    );

    return fullTypeChecker.typeToString(tsType);
};

const isWindowIdentifierName = (name: string): boolean =>
    name.toLowerCase().endsWith("window");

const getMemberPropertyName = (
    node: Readonly<TSESTree.MemberExpression>
): string | undefined => {
    if (node.property.type === "Identifier") {
        return node.property.name;
    }

    if (
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
    ) {
        return node.property.value;
    }

    return undefined;
};

const isDocumentMemberReference = (
    node: Readonly<TSESTree.MemberExpression>
): boolean => {
    const propertyName = getMemberPropertyName(node);

    if (propertyName !== "document") {
        return false;
    }

    if (node.object.type === "Identifier") {
        return isWindowIdentifierName(node.object.name);
    }

    if (node.object.type !== "MemberExpression") {
        return false;
    }

    const nestedPropertyName = getMemberPropertyName(node.object);

    if (nestedPropertyName !== "window") {
        return false;
    }

    if (node.object.object.type === "ThisExpression") {
        return true;
    }

    return (
        node.object.object.type === "Identifier" &&
        node.object.object.name === "globalThis"
    );
};

/**
 * Best-effort check for the browser `Document` object.
 *
 * Falls back to syntactic checks when parser services are unavailable.
 */
export const isDocumentObject = (
    node: Readonly<TSESTree.Node>,
    context: RuleContext,
    fullTypeChecker: Readonly<ts.TypeChecker> | undefined
): boolean => {
    if (fullTypeChecker !== undefined) {
        return (
            getNodeTypeAsString(fullTypeChecker, node, context) === "Document"
        );
    }

    if (node.type === "Identifier") {
        return node.name === "document";
    }

    if (node.type === "MemberExpression") {
        return isDocumentMemberReference(node);
    }

    return false;
};
