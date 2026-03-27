import {
    createSdlFlatConfig,
    sdlRuleSets,
} from "./eslint-benchmark-config.mjs";

/**
 * Benchmark-oriented ESLint flat config for CLI TIMING/--stats runs.
 */
/** @type {import("eslint").Linter.Config[]} */
const benchmarkTimingConfig = createSdlFlatConfig({
    rules: sdlRuleSets.recommended,
});

export default benchmarkTimingConfig;
