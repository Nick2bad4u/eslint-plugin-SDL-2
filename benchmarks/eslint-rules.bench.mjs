import { ESLint } from "eslint";
import { bench, describe, expect } from "vitest";

import {
    benchmarkFileGlobs,
    createSdlFlatConfig,
    sdlRuleSets,
} from "./eslint-benchmark-config.mjs";

/** @typedef {import("eslint").Linter.RulesRecord} BenchmarkRules */
/** @typedef {import("eslint").ESLint.LintResult} LintResult */

/**
 * Run one ESLint benchmark scenario against a fixture set.
 *
 * @param {{
 *     filePatterns: readonly string[];
 *     fix: boolean;
 *     rules: BenchmarkRules;
 * }} input
 *   - Scenario input describing file globs, fix mode, and rules.
 *
 * @returns {Promise<readonly LintResult[]>} ESLint lint results for the
 *   scenario.
 */
const lintScenario = async ({ filePatterns, fix, rules }) => {
    const eslint = new ESLint({
        cache: false,
        fix,
        overrideConfig: createSdlFlatConfig({ rules }),
        overrideConfigFile: true,
        stats: true,
    });

    return eslint.lintFiles([...filePatterns]);
};

/**
 * Ensure benchmark execution produced at least one lint result.
 *
 * @param {string} scenarioName - Human-readable benchmark scenario label.
 * @param {readonly LintResult[]} lintResults - Lint output from the scenario.
 */
const assertHasResults = (scenarioName, lintResults) => {
    if (lintResults.length === 0) {
        throw new Error(`${scenarioName}: ESLint returned no lint results.`);
    }
};

describe("eslint-plugin-sdl-2 benchmarks", () => {
    bench("recommended preset on invalid SDL fixtures", async () => {
        expect.assertions(1);

        const results = await lintScenario({
            filePatterns: benchmarkFileGlobs.typedInvalidFixtures,
            fix: false,
            rules: sdlRuleSets.recommended,
        });

        assertHasResults("recommended preset on invalid SDL fixtures", results);

        expect(results.length).toBeGreaterThan(0);
    });

    bench("recommended preset on valid baseline fixture", async () => {
        expect.assertions(1);

        const results = await lintScenario({
            filePatterns: benchmarkFileGlobs.typedValidFixtures,
            fix: false,
            rules: sdlRuleSets.recommended,
        });

        assertHasResults(
            "recommended preset on valid baseline fixture",
            results
        );

        expect(results.length).toBeGreaterThan(0);
    });

    bench("common preset on zero-message corpus", async () => {
        expect.assertions(1);

        const results = await lintScenario({
            filePatterns: benchmarkFileGlobs.recommendedZeroMessageFixture,
            fix: false,
            rules: sdlRuleSets.common,
        });

        assertHasResults("common preset on zero-message corpus", results);

        expect(results.length).toBeGreaterThan(0);
    });

    bench("single rule no-insecure-url stress", async () => {
        expect.assertions(1);

        const results = await lintScenario({
            filePatterns: benchmarkFileGlobs.insecureUrlStressFixture,
            fix: false,
            rules: {
                "sdl/no-insecure-url": "error",
            },
        });

        assertHasResults("single rule no-insecure-url stress", results);

        expect(results.length).toBeGreaterThan(0);
    });

    bench("single rule no-insecure-url stress (fix=true)", async () => {
        expect.assertions(1);

        const results = await lintScenario({
            filePatterns: benchmarkFileGlobs.insecureUrlStressFixture,
            fix: true,
            rules: {
                "sdl/no-insecure-url": "error",
            },
        });

        assertHasResults(
            "single rule no-insecure-url stress (fix=true)",
            results
        );

        expect(results.length).toBeGreaterThan(0);
    });

    bench("single rule no-insecure-random stress", async () => {
        expect.assertions(1);

        const results = await lintScenario({
            filePatterns: benchmarkFileGlobs.insecureRandomStressFixture,
            fix: false,
            rules: {
                "sdl/no-insecure-random": "error",
            },
        });

        assertHasResults("single rule no-insecure-random stress", results);

        expect(results.length).toBeGreaterThan(0);
    });
});
