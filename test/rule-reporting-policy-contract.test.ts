/**
 * @packageDocumentation
 * Contract tests for consistent SDL rule-module authoring patterns.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

const RULES_DIRECTORY = path.join(process.cwd(), "src", "rules");

/**
 * Read source text for all rule modules under `src/rules`.
 */
const getRuleSourceFiles = (): readonly (readonly [string, string])[] => {
    const fileNames = fs
        .readdirSync(RULES_DIRECTORY)
        .filter((entry) => entry.endsWith(".ts"))
        .toSorted((left, right) => left.localeCompare(right));

    return fileNames.map((fileName) => {
        const absolutePath = path.join(RULES_DIRECTORY, fileName);
        const sourceText = fs.readFileSync(absolutePath, "utf8");

        return [fileName, sourceText] as const;
    });
};

describe("rule reporting policy contract", () => {
    it("enforces createRule usage for every rule module", () => {
        for (const [fileName, sourceText] of getRuleSourceFiles()) {
            const expectedRuleName = fileName.replace(/\.ts$/v, "");

            expect(
                sourceText,
                `Rule '${fileName}' must import the shared createRule helper`
            ).toContain(
                'import { createRule } from "../_internal/create-rule.js";'
            );

            expect(
                sourceText.includes("createRule(") ||
                    sourceText.includes("createRule<"),
                `Rule '${fileName}' must be declared through createRule(...)`
            ).toBeTruthy();

            expect(
                sourceText,
                `Rule '${fileName}' must declare a stable rule name`
            ).toContain(`name: "${expectedRuleName}"`);

            const metaIndex = sourceText.indexOf("meta:");
            const defaultOptionsIndex = sourceText.indexOf("defaultOptions:");
            const hasDefaultOptions = sourceText.includes("defaultOptions:");

            if (hasDefaultOptions) {
                expect(
                    metaIndex,
                    `Rule '${fileName}' must declare meta before defaultOptions`
                ).toBeGreaterThanOrEqual(0);

                expect(
                    defaultOptionsIndex,
                    `Rule '${fileName}' must declare defaultOptions only inside meta.defaultOptions`
                ).toBeGreaterThan(metaIndex);
            }
        }
    });
});
