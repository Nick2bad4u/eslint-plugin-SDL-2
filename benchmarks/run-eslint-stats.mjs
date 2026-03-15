import { ESLint } from "eslint";
import { mkdir, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { performance } from "node:perf_hooks";

import {
    benchmarkFileGlobs,
    createSdlFlatConfig,
    repositoryRoot,
    sdlRuleSets,
} from "./eslint-benchmark-config.mjs";

/** @typedef {import("eslint").Linter.RulesRecord} BenchmarkRules */
/** @typedef {import("eslint").ESLint.LintResult} LintResult */

/**
 * @typedef {{
 *     filePatterns: readonly string[];
 *     fix: boolean;
 *     name: string;
 *     rules: BenchmarkRules;
 * }} Scenario
 */

/**
 * @typedef {{
 *     elapsedMilliseconds: number;
 *     errorCount: number;
 *     fileCount: number;
 *     name: string;
 *     warningCount: number;
 * }} ScenarioResult
 */

/** @type {readonly Scenario[]} */
const scenarios = Object.freeze([
    {
        filePatterns: benchmarkFileGlobs.typedInvalidFixtures,
        fix: false,
        name: "recommended-invalid-corpus",
        rules: sdlRuleSets.recommended,
    },
    {
        filePatterns: benchmarkFileGlobs.typedValidFixtures,
        fix: false,
        name: "recommended-valid-corpus",
        rules: sdlRuleSets.recommended,
    },
    {
        filePatterns: benchmarkFileGlobs.recommendedZeroMessageFixture,
        fix: false,
        name: "common-zero-message-corpus",
        rules: sdlRuleSets.common,
    },
    {
        filePatterns: benchmarkFileGlobs.insecureUrlStressFixture,
        fix: true,
        name: "single-rule-no-insecure-url-fix",
        rules: {
            "sdl/no-insecure-url": "error",
        },
    },
    {
        filePatterns: benchmarkFileGlobs.insecureRandomStressFixture,
        fix: false,
        name: "single-rule-no-insecure-random",
        rules: {
            "sdl/no-insecure-random": "error",
        },
    },
]);

/**
 * Run an ESLint benchmark scenario.
 *
 * @param {Scenario} scenario - Scenario configuration.
 *
 * @returns {Promise<ScenarioResult>} Scenario timing and message totals.
 */
const runScenario = async (scenario) => {
    const eslint = new ESLint({
        cache: false,
        fix: scenario.fix,
        overrideConfig: createSdlFlatConfig({ rules: scenario.rules }),
        overrideConfigFile: true,
        stats: true,
    });

    const started = performance.now();
    const results = await eslint.lintFiles([...scenario.filePatterns]);
    const elapsedMilliseconds = performance.now() - started;

    const errorCount = results.reduce(
        (count, result) => count + result.errorCount,
        0
    );
    const warningCount = results.reduce(
        (count, result) => count + result.warningCount,
        0
    );

    return {
        elapsedMilliseconds,
        errorCount,
        fileCount: results.length,
        name: scenario.name,
        warningCount,
    };
};

const run = async () => {
    /** @type {ScenarioResult[]} */
    const results = [];

    for (const scenario of scenarios) {
        const result = await runScenario(scenario);
        results.push(result);
        console.log(
            `${scenario.name}: ${result.elapsedMilliseconds.toFixed(2)}ms, files=${result.fileCount}, errors=${result.errorCount}, warnings=${result.warningCount}`
        );
    }

    const outputDir = path.resolve(repositoryRoot, "coverage", "benchmarks");
    await mkdir(outputDir, { recursive: true });

    const reportPath = path.resolve(outputDir, "eslint-stats.json");
    await writeFile(
        reportPath,
        `${JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                results,
            },
            null,
            2
        )}\n`,
        "utf8"
    );

    console.log(`Benchmark report written to ${reportPath}`);
};

await run();
