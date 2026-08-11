import prettierConfig from "prettier-config-nick2bad4u";

/**
 * @param {string} pattern Prettier override file pattern.
 *
 * @returns {string} Path-aware pattern for ordinary YAML files.
 */
function expandYamlFilePattern(pattern) {
    if (pattern === "*.yaml") {
        return "**/*.yaml";
    }
    if (pattern === "*.yml") {
        return "**/*.yml";
    }
    return pattern;
}

/**
 * Keep the shared YAML formatting policy while allowing GitHub Actions scripts
 * to retain readable block scalars.
 *
 * @param {NonNullable<import("prettier").Config["overrides"]>[number]} override
 *   Shared Prettier override.
 *
 * @returns {NonNullable<import("prettier").Config["overrides"]>[number]}
 *   Override with workflow YAML excluded from the third-party YAML parser.
 */
function withWorkflowYamlExclusion(override) {
    if (override.options?.parser !== "yaml") {
        return override;
    }

    const existingExclusions = override.excludeFiles;
    /** @type {string[]} */
    let excludedFilePatterns;
    if (Array.isArray(existingExclusions)) {
        excludedFilePatterns = existingExclusions;
    } else if (existingExclusions === undefined) {
        excludedFilePatterns = [];
    } else {
        excludedFilePatterns = [existingExclusions];
    }
    const files = Array.isArray(override.files)
        ? override.files.map((pattern) => expandYamlFilePattern(pattern))
        : expandYamlFilePattern(override.files);

    return {
        ...override,
        excludeFiles: [
            ...excludedFilePatterns,
            ".github/workflows/*.yaml",
            ".github/workflows/*.yml",
            "**/.github/workflows/*.yaml",
            "**/.github/workflows/*.yml",
        ],
        files,
    };
}

/** @type {import("prettier").Config} */
const localConfig = {
    ...prettierConfig,
    overrides: [
        ...(prettierConfig.overrides ?? []).map((override) =>
            withWorkflowYamlExclusion(override)
        ),
        {
            files: ".github/workflows/*.{yaml,yml}",
            options: {
                endOfLine: "lf",
                parser: "yaml",
                plugins: [],
                tabWidth: 4,
                useTabs: false,
            },
        },
    ],
};

export default localConfig;
