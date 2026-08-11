import { describe, expect, it } from "vitest";

import { readNpmPackFilename } from "../scripts/read-npm-pack-filename.mjs";

describe(readNpmPackFilename, () => {
    it("reads the legacy array output", () => {
        expect.assertions(1);

        expect(
            readNpmPackFilename([{ filename: "eslint-plugin-sdl-2-1.2.8.tgz" }])
        ).toBe("eslint-plugin-sdl-2-1.2.8.tgz");
    });

    it("reads the npm 12 package-name-keyed output", () => {
        expect.assertions(1);

        expect(
            readNpmPackFilename({
                "eslint-plugin-sdl-2": {
                    filename: "eslint-plugin-sdl-2-1.2.8.tgz",
                },
            })
        ).toBe("eslint-plugin-sdl-2-1.2.8.tgz");
    });

    it.each([
        [[], "exactly one npm pack record"],
        [
            [{ filename: "first.tgz" }, { filename: "second.tgz" }],
            "exactly one npm pack record",
        ],
        [[{ filename: " ".repeat(3) }], "nonblank filename"],
        [[{ filename: "temp/package.tgz" }], "trimmed basename"],
        [["package.tgz"], "record must be an object"],
        [null, "array or a package-name-keyed object"],
    ])("rejects invalid output %#", (packResult, expectedMessage) => {
        expect.assertions(1);

        expect(() => readNpmPackFilename(packResult)).toThrow(expectedMessage);
    });
});
