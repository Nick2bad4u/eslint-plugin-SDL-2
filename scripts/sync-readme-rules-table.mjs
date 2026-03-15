/**
 * @packageDocumentation
 * Synchronize or validate the README rules matrix from canonical SDL rule metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// @ts-ignore -- dist artifact is generated before this script is invoked in release flows.
import builtPlugin from "../dist/plugin.js";

/**
 * @typedef {"angular"
 *     | "angularjs"
 *     | "common"
 *     | "electron"
 *     | "node"
 *     | "react"
 *     | "required"
 *     | "recommended"
 *     | "typescript"} PresetName
 */

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         docs?: {
 *             url?: string;
 *         };
 *         fixable?: string;
 *         hasSuggestions?: boolean;
 *     };
 * }>} ReadmeRuleModule
 */

/** @typedef {Readonly<Record<string, ReadmeRuleModule>>} ReadmeRulesMap */

/** @type {readonly PresetName[]} */
const presetOrder = [
    "common",
    "typescript",
    "angular",
    "angularjs",
    "node",
    "react",
    "electron",
    "required",
    "recommended",
];

/** @type {Readonly<Record<PresetName, string>>} */
const presetIconByName = {
    angular: "🅰️",
    angularjs: "🧭",
    common: "🟢",
    electron: "⚡",
    node: "🟩",
    react: "⚛️",
    recommended: "⭐",
    required: "✅",
    typescript: "🔷",
};

/** @type {Readonly<Record<PresetName, string>>} */
const presetConfigReferenceByName = {
    angular: "sdl.configs.angular",
    angularjs: "sdl.configs.angularjs",
    common: "sdl.configs.common",
    electron: "sdl.configs.electron",
    node: "sdl.configs.node",
    react: "sdl.configs.react",
    recommended: "sdl.configs.recommended",
    required: "sdl.configs.required",
    typescript: "sdl.configs.typescript",
};

const rulesSectionHeading = "## Rules";
const presetDocsBaseUrl =
    "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets";

/**
 * @param {unknown} value
 *
 * @returns {value is Readonly<Record<string, unknown>>}
 */
const isRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * @param {string} key
 *
 * @returns {null | string}
 */
const toRuleName = (key) => {
    if (!key.startsWith("sdl/")) {
        return null;
    }

    return key.slice("sdl/".length);
};

/**
 * @param {PresetName} presetName
 *
 * @returns {readonly string[]}
 */
const collectPresetRuleNames = (presetName) => {
    const presetConfig = builtPlugin.configs[presetName];
    const configItems = Array.isArray(presetConfig)
        ? presetConfig
        : [presetConfig];
    /** @type {Set<string>} */
    const names = new Set();

    for (const configItem of configItems) {
        if (!isRecord(configItem)) {
            continue;
        }

        const rules = configItem["rules"];

        if (!isRecord(rules)) {
            continue;
        }

        for (const [ruleKey, level] of Object.entries(rules)) {
            const ruleName = toRuleName(ruleKey);

            if (ruleName === null || level === "off" || level === 0) {
                continue;
            }

            names.add(ruleName);
        }
    }

    return [...names].toSorted((left, right) => left.localeCompare(right));
};

/** @type {Readonly<Record<PresetName, Set<string>>>} */
const presetRuleNameSets =
    /** @type {Readonly<Record<PresetName, Set<string>>>} */ (
        Object.fromEntries(
            presetOrder.map((presetName) => [
                presetName,
                new Set(collectPresetRuleNames(presetName)),
            ])
        )
    );

/**
 * @param {PresetName} presetName
 *
 * @returns {string}
 */
const toPresetDocsUrl = (presetName) => `${presetDocsBaseUrl}/${presetName}`;

/**
 * @returns {readonly string[]}
 */
const createPresetLegendLines = () =>
    presetOrder.map((presetName) => {
        const docsUrl = toPresetDocsUrl(presetName);
        const presetIcon = presetIconByName[presetName];
        const configReference = presetConfigReferenceByName[presetName];

        return `  - [${presetIcon}](${docsUrl}) — [\`${configReference}\`](${docsUrl})`;
    });

/**
 * @param {ReadmeRuleModule} ruleModule
 *
 * @returns {"—" | "💡" | "🔧" | "🔧 💡"}
 */
const getRuleFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const hasSuggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (fixable) {
        return "🔧";
    }

    if (hasSuggestions) {
        return "💡";
    }

    return "—";
};

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const getPresetIndicator = (ruleName) => {
    /** @type {string[]} */
    const icons = [];

    for (const presetName of presetOrder) {
        if (!presetRuleNameSets[presetName].has(ruleName)) {
            continue;
        }

        icons.push(
            `[${presetIconByName[presetName]}](${toPresetDocsUrl(presetName)})`
        );
    }

    return icons.length > 0 ? icons.join(" ") : "—";
};

/**
 * @param {readonly [string, ReadmeRuleModule]} entry
 *
 * @returns {string}
 */
const toRuleTableRow = ([ruleName, ruleModule]) => {
    const docsUrl = ruleModule.meta?.docs?.url;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} | ${getPresetIndicator(ruleName)} |`;
};

/**
 * Generate the canonical README rules section from plugin rules metadata.
 *
 * @param {ReadmeRulesMap} rules - Plugin `rules` map.
 *
 * @returns {string} Full markdown section text starting at `## Rules`.
 */
export const generateReadmeRulesSectionFromRules = (rules) => {
    const ruleEntries = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );

    const rows = ruleEntries.map(toRuleTableRow);

    return [
        "## Rules",
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "- `Preset key` legend:",
        ...createPresetLegendLines(),
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | :-- |",
        ...rows,
        "",
    ].join("\n");
};

/**
 * Synchronize the README rules table with canonical plugin metadata.
 *
 * @param {{ writeChanges: boolean }} input
 *
 * @returns {Promise<Readonly<{ changed: boolean }>>}
 */
export const syncReadmeRulesTable = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const readmePath = resolve(workspaceRoot, "README.md");
    const readmeText = await readFile(readmePath, "utf8");

    const rulesHeadingOffset = readmeText.indexOf(rulesSectionHeading);

    if (rulesHeadingOffset < 0) {
        throw new Error("README.md is missing the '## Rules' section heading.");
    }

    const nextHeadingOffset = readmeText.indexOf(
        "\n## ",
        rulesHeadingOffset + rulesSectionHeading.length
    );

    const sectionEndOffset =
        nextHeadingOffset < 0 ? readmeText.length : nextHeadingOffset + 1;

    const prefix = readmeText.slice(0, rulesHeadingOffset).trimEnd();
    const suffix = readmeText.slice(sectionEndOffset);

    const generatedSection = generateReadmeRulesSectionFromRules(
        /** @type {ReadmeRulesMap} */(builtPlugin.rules)
    );

    const normalizedSuffix = suffix.startsWith("\n") ? suffix : `\n${suffix}`;
    const updatedReadme = `${prefix}\n\n${generatedSection}${normalizedSuffix}`;

    if (updatedReadme === readmeText) {
        return { changed: false };
    }

    if (writeChanges) {
        await writeFile(readmePath, updatedReadme, "utf8");
    }

    return { changed: true };
};

const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncReadmeRulesTable({ writeChanges });

    if (!result.changed) {
        console.log("README rules table is already up to date.");

        return;
    }

    if (writeChanges) {
        console.log("Updated README rules table from plugin metadata.");

        return;
    }

    console.error(
        "README rules table is out of date. Run: node scripts/sync-readme-rules-table.mjs --write"
    );
    process.exitCode = 1;
};

if (
    typeof process.argv[1] === "string" &&
    import.meta.url === new URL(process.argv[1], "file:").href
) {
    await runCli();
}
