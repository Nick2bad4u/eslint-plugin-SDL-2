import { describe, expect, it } from "vitest";

import sdlPlugin from "../src/plugin";

const sortAlphabetically = (values: readonly string[]): readonly string[] =>
    values.toSorted((left, right) => left.localeCompare(right));

describe("sdl plugin entry", () => {
    it("exports a frozen package entry plugin", async () => {
        expect.hasAssertions();

        const packageEntryPlugin = (await import("../plugin.mjs")).default;

        expect(Object.isFrozen(packageEntryPlugin)).toBeTruthy();
        expect(packageEntryPlugin.meta).toStrictEqual(sdlPlugin.meta);
    });

    it("exposes meta with namespace/version", () => {
        expect.hasAssertions();
        expect(sdlPlugin.meta).toStrictEqual(
            expect.objectContaining({
                name: "eslint-plugin-sdl-2",
                namespace: "sdl",
                version: expect.any(String),
            })
        );
    });

    it("registers all SDL configs", () => {
        expect.hasAssertions();
        expect(
            sortAlphabetically(Object.keys(sdlPlugin.configs ?? {}))
        ).toStrictEqual([
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
        expect.hasAssertions();

        const ruleNames = sortAlphabetically(
            Object.keys(sdlPlugin.rules ?? {})
        );

        expect(ruleNames).toStrictEqual([
            "no-angular-bypass-sanitizer",
            "no-angular-bypass-security-trust-html",
            "no-angular-innerhtml-binding",
            "no-angular-sanitization-trusted-urls",
            "no-angularjs-bypass-sce",
            "no-angularjs-enable-svg",
            "no-angularjs-ng-bind-html-without-sanitize",
            "no-angularjs-sanitization-whitelist",
            "no-angularjs-sce-resource-url-wildcard",
            "no-child-process-exec",
            "no-child-process-shell-true",
            "no-cookies",
            "no-document-domain",
            "no-document-execcommand-insert-html",
            "no-document-parse-html-unsafe",
            "no-document-write",
            "no-domparser-html-without-sanitization",
            "no-domparser-svg-without-sanitization",
            "no-dynamic-import-unsafe-url",
            "no-electron-allow-running-insecure-content",
            "no-electron-dangerous-blink-features",
            "no-electron-disable-context-isolation",
            "no-electron-disable-sandbox",
            "no-electron-disable-web-security",
            "no-electron-enable-remote-module",
            "no-electron-enable-webview-tag",
            "no-electron-experimental-features",
            "no-electron-expose-raw-ipc-renderer",
            "no-electron-insecure-certificate-error-handler",
            "no-electron-insecure-certificate-verify-proc",
            "no-electron-insecure-permission-request-handler",
            "no-electron-node-integration",
            "no-electron-permission-check-handler-allow-all",
            "no-electron-unchecked-ipc-sender",
            "no-electron-unrestricted-navigation",
            "no-electron-untrusted-open-external",
            "no-electron-webview-allowpopups",
            "no-electron-webview-insecure-webpreferences",
            "no-electron-webview-node-integration",
            "no-html-method",
            "no-http-request-to-insecure-protocol",
            "no-iframe-srcdoc",
            "no-inner-html",
            "no-insecure-random",
            "no-insecure-tls-agent-options",
            "no-insecure-url",
            "no-location-javascript-url",
            "no-message-event-without-origin-check",
            "no-msapp-exec-unsafe",
            "no-node-tls-check-server-identity-bypass",
            "no-node-tls-legacy-protocol",
            "no-node-tls-reject-unauthorized-zero",
            "no-node-tls-security-level-zero",
            "no-node-vm-run-in-context",
            "no-node-vm-source-text-module",
            "no-node-worker-threads-eval",
            "no-nonnull-assertion-on-security-input",
            "no-postmessage-star-origin",
            "no-postmessage-without-origin-allowlist",
            "no-range-create-contextual-fragment",
            "no-script-src-data-url",
            "no-script-text",
            "no-service-worker-unsafe-script-url",
            "no-set-html-unsafe",
            "no-trusted-types-policy-pass-through",
            "no-unsafe-alloc",
            "no-unsafe-cast-to-trusted-types",
            "no-window-open-without-noopener",
            "no-winjs-html-unsafe",
            "no-worker-blob-url",
            "no-worker-data-url",
        ]);
    });

    it("declares frozen and deprecated metadata for every rule", () => {
        expect.hasAssertions();

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
