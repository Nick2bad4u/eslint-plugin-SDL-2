import { describe, expect, it } from "vitest";

import { sdlConfigNames } from "../../src/_internal/config-references";

describe("config-references", () => {
    it("exposes the expected built-in preset names in deterministic order", () => {
        expect.hasAssertions();

        expect(sdlConfigNames).toStrictEqual([
            "angular",
            "angularjs",
            "common",
            "electron",
            "node",
            "react",
            "typescript",
            "required",
            "recommended",
        ]);
    });

    it("does not contain duplicate preset names", () => {
        expect.hasAssertions();

        expect(new Set(sdlConfigNames).size).toBe(sdlConfigNames.length);
    });
});
