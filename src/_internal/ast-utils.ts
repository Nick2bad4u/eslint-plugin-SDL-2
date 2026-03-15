import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type ts from "typescript";

type RuleContext = Readonly<TSESLint.RuleContext<string, unknown[]>>;

type TypeScriptParserServices = Readonly<{
    esTreeNodeToTSNodeMap: ReadonlyMap<TSESTree.Node, ts.Node>;
    program: ts.Program;
    tsNodeToESTreeNodeMap: ReadonlyMap<ts.Node, TSESTree.Node>;
}>;

const isMapLike = (value: unknown): value is ReadonlyMap<unknown, unknown> =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as { get?: unknown }).get === "function";

const isProgramLike = (value: unknown): value is ts.Program =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as { getTypeChecker?: unknown }).getTypeChecker ===
        "function";

const isTypeScriptParserServices = (
    parserServices: unknown
): parserServices is TypeScriptParserServices => {
    if (typeof parserServices !== "object" || parserServices === null) {
        return false;
    }

    const candidate = parserServices as Partial<TypeScriptParserServices>;

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
    getParserServices(context) !== undefined;

/** Returns the TypeScript type checker when parser services are available. */
export const getFullTypeChecker = (
    context: RuleContext
): ts.TypeChecker | undefined =>
    getParserServices(context)?.program.getTypeChecker();

/** Resolve the textual type for an ESTree node via parser services. */
export const getNodeTypeAsString = (
    fullTypeChecker: ts.TypeChecker | undefined,
    node: null | TSESTree.Node | undefined,
    context: RuleContext
): string => {
    if (fullTypeChecker === undefined || node === null || node === undefined) {
        return "any";
    }

    const parserServices = getParserServices(context);

    if (parserServices === undefined) {
        return "any";
    }

    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);

    if (tsNode === undefined) {
        return "any";
    }

    const tsType = fullTypeChecker.getTypeAtLocation(tsNode);

    return fullTypeChecker.typeToString(tsType);
};

const isWindowIdentifierName = (name: string): boolean =>
    name.toLowerCase().endsWith("window");

const getMemberPropertyName = (
    node: TSESTree.MemberExpression
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
    node: TSESTree.MemberExpression
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
    node: TSESTree.Node,
    context: RuleContext,
    fullTypeChecker: ts.TypeChecker | undefined
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
