import nickTwoBadFourU from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

/** @type {import("eslint").Linter.RulesRecord} */
// @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin and does not expose typed `configs.required.rules`.
const localSdlRules = plugin.configs.required.rules;

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.withoutSdl2,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local SDL",
        plugins: {
            sdl: plugin,
        },
        rules: {
            ...localSdlRules,
        },
    },
    {
        files: [
            "benchmarks/**/*.mjs",
            "commitlint.config.mjs",
            "docs/docusaurus/typedoc-plugins/**/*.mjs",
            "eslint.config.mjs",
            "remark-lint-shims.d.ts",
            "scripts/**/*.mjs",
        ],
        name: "Tooling Script Relaxations",
        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-misused-spread": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "import-x/unambiguous": "off",
            "jsdoc/check-tag-names": "off",
            "jsdoc/match-description": "off",
            "jsdoc/no-undefined-types": "off",
            "jsdoc/reject-any-type": "off",
            "jsdoc/require-throws": "off",
        },
    },
    {
        files: ["src/_internal/config-references.ts"],
        name: "Config Reference Ordering",
        rules: {
            "perfectionist/sort-arrays": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
