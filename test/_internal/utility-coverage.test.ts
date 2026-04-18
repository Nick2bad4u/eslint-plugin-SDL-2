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

        expect(hasFullTypeInformation(validContext)).toBeTruthy();
        expect(getFullTypeChecker(validContext)).toBe(fakeTypeChecker);
        expect(hasFullTypeInformation({ sourceCode: {} })).toBeFalsy();
        expect(getFullTypeChecker({ sourceCode: {} })).toBeUndefined();
    });

    it("falls back to 'any' when type data is missing", () => {
        const node = asType<TSESTree.Identifier>({
            name: "value",
            type: "Identifier",
        });

        expect(getNodeTypeAsString(undefined, node, {})).toBe("any");
        expect(getNodeTypeAsString(undefined, null, {})).toBe("any");
        expect(getNodeTypeAsString(undefined, undefined, {})).toBe("any");
    });

    it("detects document object syntactically without type checker", () => {
        const documentIdentifier = asType<TSESTree.Identifier>({
            name: "document",
            type: "Identifier",
        });

        const windowDocument = asType<TSESTree.MemberExpression>({
            computed: false,
            object: { name: "window", type: "Identifier" },
            optional: false,
            property: { name: "document", type: "Identifier" },
            type: "MemberExpression",
        });

        const thisWindowDocument = asType<TSESTree.MemberExpression>({
            computed: false,
            object: {
                computed: false,
                object: { type: "ThisExpression" },
                optional: false,
                property: { name: "window", type: "Identifier" },
                type: "MemberExpression",
            },
            optional: false,
            property: { name: "document", type: "Identifier" },
            type: "MemberExpression",
        });

        const notDocument = asType<TSESTree.Identifier>({
            name: "notDocument",
            type: "Identifier",
        });

        expect(isDocumentObject(documentIdentifier, {}, undefined)).toBeTruthy();
        expect(isDocumentObject(windowDocument, {}, undefined)).toBeTruthy();
        expect(isDocumentObject(thisWindowDocument, {}, undefined)).toBeTruthy();
        expect(isDocumentObject(notDocument, {}, undefined)).toBeFalsy();
    });
});

describe("estree-utils", () => {
    it("extracts member and property names", () => {
        const dotMember = asType<TSESTree.MemberExpression>({
            computed: false,
            object: { name: "obj", type: "Identifier" },
            optional: false,
            property: { name: "prop", type: "Identifier" },
            type: "MemberExpression",
        });

        const bracketMember = asType<TSESTree.MemberExpression>({
            computed: true,
            object: { name: "obj", type: "Identifier" },
            optional: false,
            property: { raw: "'prop'", type: "Literal", value: "prop" },
            type: "MemberExpression",
        });

        const unsupportedMember = asType<TSESTree.MemberExpression>({
            computed: true,
            object: { name: "obj", type: "Identifier" },
            optional: false,
            property: { name: "dynamic", type: "Identifier" },
            type: "MemberExpression",
        });

        expect(getMemberPropertyName(dotMember)).toBe("prop");
        expect(getMemberPropertyName(bracketMember)).toBe("prop");
        expect(getMemberPropertyName(unsupportedMember)).toBeUndefined();
    });

    it("extracts object property names and values", () => {
        const initProperty = asType<TSESTree.Property>({
            computed: false,
            key: { name: "secureProtocol", type: "Identifier" },
            kind: "init",
            method: false,
            shorthand: false,
            type: "Property",
            value: {
                raw: "'TLSv1_method'",
                type: "Literal",
                value: "TLSv1_method",
            },
        });

        const objectExpression = asType<TSESTree.ObjectExpression>({
            properties: [initProperty],
            type: "ObjectExpression",
        });

        expect(getPropertyName(initProperty)).toBe("secureProtocol");
        expect(getPropertyByName(objectExpression, "secureProtocol")).toBe(
            initProperty
        );
        expect(getPropertyByName(objectExpression, "missing")).toBeUndefined();
    });

    it("resolves static string values from expressions and JSX attributes", () => {
        const literal = asType<TSESTree.Literal>({
            raw: "'https://example.com'",
            type: "Literal",
            value: "https://example.com",
        });

        const template = asType<TSESTree.TemplateLiteral>({
            expressions: [],
            quasis: [
                {
                    tail: true,
                    type: "TemplateElement",
                    value: { cooked: "safe", raw: "safe" },
                },
            ],
            type: "TemplateLiteral",
        });

        const jsxLiteral = asType<TSESTree.JSXAttribute["value"]>({
            raw: "'safe'",
            type: "Literal",
            value: "safe",
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
            name: "tls",
            type: "Identifier",
        });

        const createServerCallee = asType<TSESTree.MemberExpression>({
            computed: false,
            object: tlsIdentifier,
            optional: false,
            property: { name: "createServer", type: "Identifier" },
            type: "MemberExpression",
        });

        const newAgentCallee = asType<TSESTree.MemberExpression>({
            computed: false,
            object: { name: "https", type: "Identifier" },
            optional: false,
            property: { name: "Agent", type: "Identifier" },
            type: "MemberExpression",
        });

        const optionsNode = asType<TSESTree.ObjectExpression>({
            parent: {
                arguments: [],
                callee: createServerCallee,
                optional: false,
                type: "CallExpression",
            },
            properties: [],
            type: "ObjectExpression",
        });

        const assignLeft = asType<TSESTree.MemberExpression>({
            computed: false,
            object: { name: "tls", type: "Identifier" },
            optional: false,
            property: { name: "DEFAULT_MIN_VERSION", type: "Identifier" },
            type: "MemberExpression",
        });

        expect(isNodeTlsObjectExpression(tlsIdentifier)).toBeTruthy();
        expect(isRelevantNodeTlsCall(createServerCallee)).toBeTruthy();
        expect(isRelevantNodeTlsConstructor(newAgentCallee)).toBeTruthy();
        expect(isRelevantNodeTlsOptionsObject(optionsNode)).toBeTruthy();
        expect(
            isNodeTlsStaticMember(assignLeft, new Set(["DEFAULT_MIN_VERSION"]))
        ).toBeTruthy();
    });
});

describe("worker-code-loading", () => {
    it("recognizes worker-related URL and API patterns", () => {
        expect(isBlobUrl("blob:https://example.com")).toBeTruthy();
        expect(isDataUrl("data:text/javascript,alert(1)")).toBeTruthy();
        expect(isBlobUrl("https://example.com")).toBeFalsy();

        const workerCtor = asType<TSESTree.Identifier>({
            name: "Worker",
            type: "Identifier",
        });

        const importScriptsCallee = asType<TSESTree.Identifier>({
            name: "importScripts",
            type: "Identifier",
        });

        const serviceWorkerAccess = asType<TSESTree.MemberExpression>({
            computed: false,
            object: { name: "navigator", type: "Identifier" },
            optional: false,
            property: { name: "serviceWorker", type: "Identifier" },
            type: "MemberExpression",
        });

        const registerCallee = asType<TSESTree.MemberExpression>({
            computed: false,
            object: serviceWorkerAccess,
            optional: false,
            property: { name: "register", type: "Identifier" },
            type: "MemberExpression",
        });

        const createObjectUrl = asType<TSESTree.CallExpression>({
            arguments: [],
            callee: {
                computed: false,
                object: { name: "URL", type: "Identifier" },
                optional: false,
                property: { name: "createObjectURL", type: "Identifier" },
                type: "MemberExpression",
            },
            optional: false,
            type: "CallExpression",
        });

        expect(
            isWorkerGlobalObject(asType({ name: "self", type: "Identifier" }))
        ).toBeTruthy();
        expect(isWorkerConstructor(workerCtor)).toBeTruthy();
        expect(isImportScriptsCall(importScriptsCallee)).toBeTruthy();
        expect(isServiceWorkerContainerAccess(serviceWorkerAccess)).toBeTruthy();
        expect(isServiceWorkerRegisterCall(registerCallee)).toBeTruthy();
        expect(isUrlCreateObjectUrlCall(createObjectUrl)).toBeTruthy();
    });
});
