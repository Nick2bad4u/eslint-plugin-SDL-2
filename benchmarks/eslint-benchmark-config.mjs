import tsParser from "@typescript-eslint/parser";

import plugin from "../plugin.mjs";

/** @typedef {import("eslint").Linter.RulesRecord} BenchmarkRules */

export const repositoryRoot = process.cwd();

export const benchmarkFileGlobs = Object.freeze({
    insecureRandomStressFixture: Object.freeze([
        "benchmarks/fixtures/insecure-random.stress.ts",
    ]),
    insecureUrlStressFixture: Object.freeze([
        "benchmarks/fixtures/insecure-url.stress.ts",
    ]),
    recommendedZeroMessageFixture: Object.freeze([
        "benchmarks/fixtures/recommended-zero-message.baseline.ts",
    ]),
    typedInvalidFixtures: Object.freeze([
        "test/fixtures/ts/compat-no-insecure-url.invalid.ts",
        "test/fixtures/ts/compat-no-insecure-random.invalid.ts",
    ]),
    typedValidFixtures: Object.freeze(["test/fixtures/ts/estree.ts"]),
});

/**
 * Normalize unknown preset rules value into a rules record.
 *
 * @param {unknown} value - Candidate rules object.
 * @param {string} label - Diagnostic label used in thrown errors.
 *
 * @returns {BenchmarkRules} Normalized ESLint rules record.
 */
const ensureRulesRecord = (value, label) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new TypeError(`${label} must be a non-null object.`);
    }

    /** @type {BenchmarkRules} */
    const result = {};
    const entries =
        /** @type {[string, import("eslint").Linter.RuleEntry][]} */ (
            Object.entries(value)
        );

    for (const [ruleName, ruleEntry] of entries) {
        result[ruleName] = ruleEntry;
    }

    return result;
};

/**
 * Resolve a flat-config rule set from plugin preset metadata.
 *
 * @param {"common" | "recommended" | "required"} presetName - SDL preset name.
 *
 * @returns {Readonly<BenchmarkRules>} Frozen rules record for benchmark usage.
 */
const resolveRuleSet = (presetName) => {
    const preset = plugin.configs?.[presetName];
    if (typeof preset !== "object" || Array.isArray(preset)) {
        throw new TypeError(
            `plugin.configs.${presetName} must be a flat config object.`
        );
    }

    return Object.freeze(
        ensureRulesRecord(preset.rules ?? {}, `${presetName} preset rules`)
    );
};

export const sdlRuleSets = Object.freeze({
    common: resolveRuleSet("common"),
    recommended: resolveRuleSet("recommended"),
    required: resolveRuleSet("required"),
});

/**
 * Build the benchmark flat-config payload with the SDL plugin and rule set.
 *
 * @type {(options: {
 *     rules: BenchmarkRules;
 * }) => import("eslint").Linter.Config[]}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- Function signature is fully documented through the exported @type annotation above.
export const createSdlFlatConfig = (options) => [
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                project: "./tsconfig.eslint.json",
                sourceType: "module",
                tsconfigRootDir: repositoryRoot,
            },
        },
        name: "benchmark:sdl",
        plugins: {
            sdl: plugin,
        },
        rules: options.rules,
    },
];
