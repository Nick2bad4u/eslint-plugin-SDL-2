import { describe, expect, it } from "vitest";

import sdlPlugin from "../src/plugin";

const sortAlphabetically = (values: readonly string[]): readonly string[] =>
    values.toSorted((left, right) => left.localeCompare(right));

describe("sdl plugin entry", () => {
    it("exposes meta with namespace/version", () => {
        expect(sdlPlugin.meta).toEqual(
            expect.objectContaining({
                name: "eslint-plugin-sdl-2",
                namespace: "sdl",
                version: expect.any(String),
            })
        );
    });

    it("registers all SDL configs", () => {
        expect(
            sortAlphabetically(Object.keys(sdlPlugin.configs ?? {}))
        ).toEqual([
            "angular",
            "angularjs",
            "common",
            "electron",
            "node",
            "react",
            "recommended",
            "required",
            "typescript",
        ]);
    });

    it("registers all migrated SDL rules", () => {
        const ruleNames = sortAlphabetically(
            Object.keys(sdlPlugin.rules ?? {})
        );

        expect(ruleNames).toEqual([
            "no-angular-bypass-sanitizer",
            "no-angular-bypass-security-trust-html",
            "no-angular-innerhtml-binding",
            "no-angular-sanitization-trusted-urls",
            "no-angularjs-bypass-sce",
            "no-angularjs-enable-svg",
            "no-angularjs-ng-bind-html-without-sanitize",
            "no-angularjs-sanitization-whitelist",
            "no-angularjs-sce-resource-url-wildcard",
            "no-child-process-shell-true",
            "no-cookies",
            "no-document-domain",
            "no-document-write",
            "no-domparser-html-without-sanitization",
            "no-electron-allow-running-insecure-content",
            "no-electron-dangerous-blink-features",
            "no-electron-disable-context-isolation",
            "no-electron-disable-sandbox",
            "no-electron-disable-web-security",
            "no-electron-enable-remote-module",
            "no-electron-insecure-certificate-error-handler",
            "no-electron-insecure-certificate-verify-proc",
            "no-electron-insecure-permission-request-handler",
            "no-electron-node-integration",
            "no-electron-unchecked-ipc-sender",
            "no-electron-unrestricted-navigation",
            "no-electron-untrusted-open-external",
            "no-electron-webview-allowpopups",
            "no-electron-webview-node-integration",
            "no-html-method",
            "no-http-request-to-insecure-protocol",
            "no-inner-html",
            "no-insecure-random",
            "no-insecure-tls-agent-options",
            "no-insecure-url",
            "no-location-javascript-url",
            "no-msapp-exec-unsafe",
            "no-node-tls-reject-unauthorized-zero",
            "no-nonnull-assertion-on-security-input",
            "no-postmessage-star-origin",
            "no-postmessage-without-origin-allowlist",
            "no-unsafe-alloc",
            "no-unsafe-cast-to-trusted-types",
            "no-window-open-without-noopener",
            "no-winjs-html-unsafe",
        ]);
    });

    it("declares frozen and deprecated metadata for every rule", () => {
        for (const [ruleName, rule] of Object.entries(sdlPlugin.rules ?? {})) {
            expect(
                rule.meta?.deprecated,
                `${ruleName} should define meta.deprecated`
            ).toBeFalsy();
            expect(
                rule.meta?.docs?.frozen,
                `${ruleName} should define meta.docs.frozen`
            ).toBeFalsy();
        }
    });
});
