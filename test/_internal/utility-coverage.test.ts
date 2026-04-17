import type { TSESTree } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import {
    getFullTypeChecker,
    getNodeTypeAsString,
    hasFullTypeInformation,
    isDocumentObject,
} from "../../src/_internal/ast-utils";
import {
    getMemberPropertyName,
    getPropertyByName,
    getPropertyName,
    getStaticJsxAttributeStringValue,
    getStaticStringValue,
} from "../../src/_internal/estree-utils";
import {
    isNodeTlsObjectExpression,
    isNodeTlsStaticMember,
    isRelevantNodeTlsCall,
    isRelevantNodeTlsConstructor,
    isRelevantNodeTlsOptionsObject,
} from "../../src/_internal/node-tls-config";
import {
    isBlobUrl,
    isDataUrl,
    isImportScriptsCall,
    isServiceWorkerContainerAccess,
    isServiceWorkerRegisterCall,
    isUrlCreateObjectUrlCall,
    isWorkerConstructor,
    isWorkerGlobalObject,
} from "../../src/_internal/worker-code-loading";

const asType = <T>(value: unknown): T => value as T;

describe("ast-utils", () => {
    it("handles parser services and type checker access", () => {
        const fakeTypeChecker = { typeToString: () => "Document" };
        const fakeProgram = { getTypeChecker: () => fakeTypeChecker };
        const fakeMap = new Map();

        const validContext = {
            sourceCode: {
                parserServices: {
                    esTreeNodeToTSNodeMap: fakeMap,
                    program: fakeProgram,
                    tsNodeToESTreeNodeMap: fakeMap,
                },
            },
        };

        expect(hasFullTypeInformation(validContext)).toBe(true);
        expect(getFullTypeChecker(validContext)).toBe(fakeTypeChecker);
        expect(hasFullTypeInformation({ sourceCode: {} })).toBe(false);
        expect(getFullTypeChecker({ sourceCode: {} })).toBeUndefined();
    });

    it("falls back to 'any' when type data is missing", () => {
        const node = asType<TSESTree.Identifier>({
            type: "Identifier",
            name: "value",
        });

        expect(getNodeTypeAsString(undefined, node, {})).toBe("any");
        expect(getNodeTypeAsString(undefined, null, {})).toBe("any");
        expect(getNodeTypeAsString(undefined, undefined, {})).toBe("any");
    });

    it("detects document object syntactically without type checker", () => {
        const documentIdentifier = asType<TSESTree.Identifier>({
            type: "Identifier",
            name: "document",
        });

        const windowDocument = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: { type: "Identifier", name: "window" },
            property: { type: "Identifier", name: "document" },
            optional: false,
        });

        const thisWindowDocument = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: {
                type: "MemberExpression",
                computed: false,
                object: { type: "ThisExpression" },
                property: { type: "Identifier", name: "window" },
                optional: false,
            },
            property: { type: "Identifier", name: "document" },
            optional: false,
        });

        const notDocument = asType<TSESTree.Identifier>({
            type: "Identifier",
            name: "notDocument",
        });

        expect(isDocumentObject(documentIdentifier, {}, undefined)).toBe(true);
        expect(isDocumentObject(windowDocument, {}, undefined)).toBe(true);
        expect(isDocumentObject(thisWindowDocument, {}, undefined)).toBe(true);
        expect(isDocumentObject(notDocument, {}, undefined)).toBe(false);
    });
});

describe("estree-utils", () => {
    it("extracts member and property names", () => {
        const dotMember = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: { type: "Identifier", name: "obj" },
            property: { type: "Identifier", name: "prop" },
            optional: false,
        });

        const bracketMember = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: true,
            object: { type: "Identifier", name: "obj" },
            property: { type: "Literal", value: "prop", raw: "'prop'" },
            optional: false,
        });

        const unsupportedMember = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: true,
            object: { type: "Identifier", name: "obj" },
            property: { type: "Identifier", name: "dynamic" },
            optional: false,
        });

        expect(getMemberPropertyName(dotMember)).toBe("prop");
        expect(getMemberPropertyName(bracketMember)).toBe("prop");
        expect(getMemberPropertyName(unsupportedMember)).toBeUndefined();
    });

    it("extracts object property names and values", () => {
        const initProperty = asType<TSESTree.Property>({
            type: "Property",
            kind: "init",
            method: false,
            shorthand: false,
            computed: false,
            key: { type: "Identifier", name: "secureProtocol" },
            value: {
                type: "Literal",
                value: "TLSv1_method",
                raw: "'TLSv1_method'",
            },
        });

        const objectExpression = asType<TSESTree.ObjectExpression>({
            type: "ObjectExpression",
            properties: [initProperty],
        });

        expect(getPropertyName(initProperty)).toBe("secureProtocol");
        expect(getPropertyByName(objectExpression, "secureProtocol")).toBe(
            initProperty
        );
        expect(getPropertyByName(objectExpression, "missing")).toBeUndefined();
    });

    it("resolves static string values from expressions and JSX attributes", () => {
        const literal = asType<TSESTree.Literal>({
            type: "Literal",
            value: "https://example.com",
            raw: "'https://example.com'",
        });

        const template = asType<TSESTree.TemplateLiteral>({
            type: "TemplateLiteral",
            expressions: [],
            quasis: [
                {
                    type: "TemplateElement",
                    tail: true,
                    value: { raw: "safe", cooked: "safe" },
                },
            ],
        });

        const jsxLiteral = asType<TSESTree.JSXAttribute["value"]>({
            type: "Literal",
            value: "safe",
            raw: "'safe'",
        });

        expect(getStaticStringValue(literal)).toBe("https://example.com");
        expect(getStaticStringValue(template)).toBe("safe");
        expect(getStaticJsxAttributeStringValue(jsxLiteral)).toBe("safe");
        expect(getStaticJsxAttributeStringValue(null)).toBeUndefined();
    });
});

describe("node-tls-config", () => {
    it("recognizes relevant TLS object/call/constructor patterns", () => {
        const tlsIdentifier = asType<TSESTree.Identifier>({
            type: "Identifier",
            name: "tls",
        });

        const createServerCallee = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: tlsIdentifier,
            property: { type: "Identifier", name: "createServer" },
            optional: false,
        });

        const newAgentCallee = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: { type: "Identifier", name: "https" },
            property: { type: "Identifier", name: "Agent" },
            optional: false,
        });

        const optionsNode = asType<TSESTree.ObjectExpression>({
            type: "ObjectExpression",
            properties: [],
            parent: {
                type: "CallExpression",
                callee: createServerCallee,
                arguments: [],
                optional: false,
            },
        });

        const assignLeft = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: { type: "Identifier", name: "tls" },
            property: { type: "Identifier", name: "DEFAULT_MIN_VERSION" },
            optional: false,
        });

        expect(isNodeTlsObjectExpression(tlsIdentifier)).toBe(true);
        expect(isRelevantNodeTlsCall(createServerCallee)).toBe(true);
        expect(isRelevantNodeTlsConstructor(newAgentCallee)).toBe(true);
        expect(isRelevantNodeTlsOptionsObject(optionsNode)).toBe(true);
        expect(
            isNodeTlsStaticMember(assignLeft, new Set(["DEFAULT_MIN_VERSION"]))
        ).toBe(true);
    });
});

describe("worker-code-loading", () => {
    it("recognizes worker-related URL and API patterns", () => {
        expect(isBlobUrl("blob:https://example.com")).toBe(true);
        expect(isDataUrl("data:text/javascript,alert(1)")).toBe(true);
        expect(isBlobUrl("https://example.com")).toBe(false);

        const workerCtor = asType<TSESTree.Identifier>({
            type: "Identifier",
            name: "Worker",
        });

        const importScriptsCallee = asType<TSESTree.Identifier>({
            type: "Identifier",
            name: "importScripts",
        });

        const serviceWorkerAccess = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: { type: "Identifier", name: "navigator" },
            property: { type: "Identifier", name: "serviceWorker" },
            optional: false,
        });

        const registerCallee = asType<TSESTree.MemberExpression>({
            type: "MemberExpression",
            computed: false,
            object: serviceWorkerAccess,
            property: { type: "Identifier", name: "register" },
            optional: false,
        });

        const createObjectUrl = asType<TSESTree.CallExpression>({
            type: "CallExpression",
            callee: {
                type: "MemberExpression",
                computed: false,
                object: { type: "Identifier", name: "URL" },
                property: { type: "Identifier", name: "createObjectURL" },
                optional: false,
            },
            arguments: [],
            optional: false,
        });

        expect(
            isWorkerGlobalObject(asType({ type: "Identifier", name: "self" }))
        ).toBe(true);
        expect(isWorkerConstructor(workerCtor)).toBe(true);
        expect(isImportScriptsCall(importScriptsCallee)).toBe(true);
        expect(isServiceWorkerContainerAccess(serviceWorkerAccess)).toBe(true);
        expect(isServiceWorkerRegisterCall(registerCallee)).toBe(true);
        expect(isUrlCreateObjectUrlCall(createObjectUrl)).toBe(true);
    });
});
