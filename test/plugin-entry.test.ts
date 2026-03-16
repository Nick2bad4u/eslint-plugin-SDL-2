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
            "no-angular-sanitization-trusted-urls",
            "no-angularjs-bypass-sce",
            "no-angularjs-enable-svg",
            "no-angularjs-sanitization-whitelist",
            "no-cookies",
            "no-document-domain",
            "no-document-write",
            "no-electron-allow-running-insecure-content",
            "no-electron-dangerous-blink-features",
            "no-electron-disable-context-isolation",
            "no-electron-disable-sandbox",
            "no-electron-disable-web-security",
            "no-electron-enable-remote-module",
            "no-electron-insecure-certificate-error-handler",
            "no-electron-node-integration",
            "no-electron-untrusted-open-external",
            "no-html-method",
            "no-inner-html",
            "no-insecure-random",
            "no-insecure-url",
            "no-msapp-exec-unsafe",
            "no-node-tls-reject-unauthorized-zero",
            "no-postmessage-star-origin",
            "no-unsafe-alloc",
            "no-window-open-without-noopener",
            "no-winjs-html-unsafe",
        ]);
    });
});
