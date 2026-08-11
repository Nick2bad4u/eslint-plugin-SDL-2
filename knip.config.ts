/**
 * Repository-specific configuration for Knip dependency analysis.
 *
 * @packageDocumentation
 */
import type { KnipConfig } from "knip";

/**
 * Knip configuration that scopes entry points and dependency heuristics to the
 * repository layout.
 */
const knipConfig: KnipConfig = {
    $schema: "https://unpkg.com/knip@6/schema.json",
    ignore: ["docs/docusaurus/src/css/custom.css.d.ts"],
    ignoreBinaries: [
        "gitleaks",
        "grype",
        "lychee",
        // Knip can mistake its own config path for a binary entry point.
        "knip.config.ts",
    ],
    ignoreDependencies: [
        ".*prettier.*",
        "@easyops-cn/docusaurus-search-local",
        "@easyops-cn/docusaurus-theme-docusaurus-search-local",
        "@eslint.*",
        "@microsoft/tsdoc-config",
        "@types.*",
        "eslint.*",
        "postcss.*",
        "remark.*",
        "stylelint.*",
        "ts.*",
        "type.*",

        // Items flagged by knip report (ignored to suppress false-positives / repo-local tools)
        "clsx",
        "react-github-btn",
        "htmlhint",
        "leasot",
        "markdown-link-check",
        "sloc",
        "storybook",
        "react",

        // These packages are consumed through package-script paths, config-file
        // extends, or runtime plugin names that Knip cannot resolve statically.
        "@stryker-ignorer/console-all",
        "git-cliff",
        "gitcliff-config-nick2bad4u",
        "gitleaks-config-nick2bad4u",
        "jscpd-config-nick2bad4u",
        "lychee-config-nick2bad4u",
        "ncu-config-nick2bad4u",
        "yamllint-config-nick2bad4u",
        /^@stryker-ignorer\/\*$/u,
        /^@stryker-mutator\/\*$/u,
    ],
    ignoreFiles: [
        "benchmarks/fixtures/**",
        "docs/docusaurus/src/theme/PwaReloadPopup/index.tsx",
        "plugin.d.mts",
        "scripts/*.d.mts",
        "test/fixtures/**",
    ],
    ignoreIssues: {
        ".secretlintrc.cjs": ["exports"],
        "benchmark/cases/**/*.ts": ["exports"],
        "benchmark/config.ts": ["exports"],
        "docs/docusaurus/src/theme/PwaReloadPopup/styles.module.css.d.ts": [
            "exports",
        ],
        "vitest.stryker.config.ts": ["exports"],
    },
    ignoreExportsUsedInFile: {
        interface: true,
        type: true,
    },
    includeEntryExports: true,
    rules: {
        binaries: "error",
        dependencies: "error",
        devDependencies: "error",
        duplicates: "error",
        enumMembers: "warn",
        exports: "warn",
        files: "error",
        nsExports: "warn",
        nsTypes: "warn",
        optionalPeerDependencies: "error",
        types: "warn",
        unlisted: "error",
        unresolved: "error",
    },
    workspaces: {
        ".": {
            entry: [
                ".secretlintrc.cjs",
                "benchmark/cases/**/*.ts",
                "benchmark/config.ts",
                "scripts/bootstrap-eslint-repo.mjs",
                "scripts/create-eslint-plugin-project.mjs",
                "vitest.stryker.config.ts",
            ],
        },
    },
};

export default knipConfig;
