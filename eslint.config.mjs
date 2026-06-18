import nickTwoBadFourU from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

/** @type {import("eslint").Linter.RulesRecord} */
// @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin and does not expose typed `configs.required.rules`.
const localSdlRules = plugin.configs.required.rules;

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.withoutSdl2,

    {
        ignores: [
            "benchmark/**",
            "benchmarks/**",
            "docs/docusaurus/typedoc-plugins/**",
            "knip.config.ts",
            "remark-lint-shims.d.ts",
            "vitest.stryker.config.ts",
        ],
        name: "Non-Project Tooling Ignores",
    },
    {
        name: "Repository Type Import Compatibility",
        rules: {
            "no-duplicate-imports": [
                "error",
                { allowSeparateTypeImports: true },
            ],
        },
    },

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
            "eslint.config.mjs",
            "plugin.mjs",
            "remark-lint-shims.d.ts",
            "scripts/**/*.mjs",
            "stryker.config.mjs",
        ],
        name: "Tooling Script Relaxations",
        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-misused-spread": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "import-x/unambiguous": "off",
            "jsdoc/check-tag-names": "off",
            "jsdoc/match-description": "off",
            "jsdoc/no-undefined-types": "off",
            "jsdoc/reject-any-type": "off",
            "jsdoc/require-throws": "off",
        },
    },
    {
        files: [
            "docs/docusaurus/docusaurus.config.ts",
            "docs/docusaurus/sidebars.rules.ts",
            "docs/docusaurus/sidebars.ts",
        ],
        name: "Docusaurus Build Config Relaxations",
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "n/no-process-env": "off",
            "n/no-sync": "off",
            "prefer-named-capture-group": "off",
            "regexp/prefer-named-capture-group": "off",
            "security/detect-non-literal-fs-filename": "off",
            "security/detect-non-literal-regexp": "off",
            "unicorn/no-array-sort": "off",
            "unicorn/no-non-function-verb-prefix": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/prefer-number-coercion": "off",
            "unicorn/prefer-short-arrow-method": "off",
            "unicorn/prefer-temporal": "off",
            "unicorn/relative-url-style": "off",
        },
    },
    {
        files: ["docs/docusaurus/src/**/*.{ts,tsx}"],
        name: "Docusaurus Client Runtime Relaxations",
        rules: {
            "@typescript-eslint/no-dynamic-delete": "off",
            "canonical/filename-no-index": "off",
            "prefer-named-capture-group": "off",
            "regexp/no-super-linear-backtracking": "off",
            "regexp/prefer-named-capture-group": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "runtime-cleanup/no-unmanaged-event-listeners": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-break-in-nested-loop": "off",
            "unicorn/no-global-object-property-assignment": "off",
            "unicorn/no-immediate-mutation": "off",
            "unicorn/prefer-single-call": "off",
        },
    },
    {
        files: ["src/_internal/config-references.ts"],
        name: "Config Reference Ordering",
        rules: {
            "perfectionist/sort-arrays": "off",
        },
    },
    {
        files: ["src/_internal/rules-registry.ts"],
        name: "Rule Registry Fan-In",
        rules: {
            "import-x/max-dependencies": "off",
        },
    },
    {
        files: ["test/**/*.{ts,tsx,mts,cts}"],
        name: "Vitest Harness Relaxations",
        rules: {
            "test-signal/require-negative-path": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/no-non-function-verb-prefix": "off",
            "unicorn/no-top-level-side-effects": "off",
            "unicorn/no-unreadable-for-of-expression": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/prefer-https": "off",
        },
    },
    {
        files: [
            "**/docs/docusaurus/sidebars.rules.ts",
            "**/docs/docusaurus/sidebars.ts",
        ],
        name: "Docusaurus Sidebar Regex Target Compatibility",
        rules: {
            "regexp/require-unicode-sets-regexp": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
