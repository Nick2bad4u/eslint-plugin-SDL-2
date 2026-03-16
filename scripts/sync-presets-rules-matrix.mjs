/**
 * @packageDocumentation
 * Synchronize or validate per-preset rules tables from canonical SDL plugin metadata.
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
 * }>} RuleModule
 */

/** @type {readonly PresetName[]} */
const presetNames = [
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

const presetRulesSectionHeading = "## Rules in this preset";
const presetsDocsDirectoryPath = "docs/rules/presets";

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

/**
 * @param {RuleModule} ruleModule
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
 * @returns {RuleModule}
 */
const getRuleModuleByName = (ruleName) => {
    const rules = builtPlugin.rules;

    if (!isRecord(rules)) {
        throw new TypeError("Built plugin is missing a rules map.");
    }

    const candidate = rules[ruleName];

    if (!isRecord(candidate)) {
        throw new TypeError(`Rule '${ruleName}' is missing from built plugin.`);
    }

    return /** @type {RuleModule} */ (candidate);
};

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const toPresetRuleRow = (ruleName) => {
    const ruleModule = getRuleModuleByName(ruleName);
    const docsUrl = ruleModule.meta?.docs?.url;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} |`;
};

/**
 * @param {readonly string[]} ruleNames
 *
 * @returns {string}
 */
const createPresetRulesTable = (ruleNames) => {
    if (ruleNames.length === 0) {
        return [
            "| Rule | Fix |",
            "| --- | :-: |",
            "| — | — |",
        ].join("\n");
    }

    return [
        "| Rule | Fix |",
        "| --- | :-: |",
        ...ruleNames.map(toPresetRuleRow),
    ].join("\n");
};

/**
 * @param {PresetName} presetName
 *
 * @returns {string}
 */
const generatePresetRulesSection = (presetName) => {
    const presetRuleNames = collectPresetRuleNames(presetName);

    return [
        presetRulesSectionHeading,
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "",
        createPresetRulesTable(presetRuleNames),
        "",
    ].join("\n");
};

/**
 * @param {string} markdown
 *
 * @returns {{ headingOffset: number; sectionEndOffset: number }}
 */
const findPresetRulesSection = (markdown) => {
    const headingOffset = markdown.indexOf(presetRulesSectionHeading);

    if (headingOffset < 0) {
        return { headingOffset: -1, sectionEndOffset: markdown.length };
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        headingOffset + presetRulesSectionHeading.length
    );

    return {
        headingOffset,
        sectionEndOffset:
            nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset + 1,
    };
};

/**
 * @param {{ writeChanges: boolean }} input
 *
 * @returns {Promise<Readonly<{ changedFiles: readonly string[] }>>}
 */
export const syncPresetRulesMatrix = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    /** @type {string[]} */
    const changedFiles = [];

    for (const presetName of presetNames) {
        const presetDocPath = resolve(
            workspaceRoot,
            presetsDocsDirectoryPath,
            `${presetName}.md`
        );

        let markdown;

        try {
            markdown = await readFile(presetDocPath, "utf8");
        } catch {
            continue;
        }

        const generatedSection = generatePresetRulesSection(presetName);
        const { headingOffset, sectionEndOffset } =
            findPresetRulesSection(markdown);

        const updatedMarkdown =
            headingOffset < 0
                ? `${markdown.trimEnd()}\n\n${generatedSection}`
                : `${markdown.slice(0, headingOffset).trimEnd()}\n\n${generatedSection}${markdown.slice(sectionEndOffset)}`;

        if (updatedMarkdown === markdown) {
            continue;
        }

        changedFiles.push(presetDocPath);

        if (writeChanges) {
            await writeFile(presetDocPath, updatedMarkdown, "utf8");
        }
    }

    return { changedFiles };
};

const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncPresetRulesMatrix({ writeChanges });

    if (result.changedFiles.length === 0) {
        console.log("Preset rules matrices are already up to date.");

        return;
    }

    if (writeChanges) {
        console.log(
            `Updated ${result.changedFiles.length} preset document(s).`
        );

        return;
    }

    console.error(
        `Preset rules matrices are out of date in ${result.changedFiles.length} file(s). Run: node scripts/sync-presets-rules-matrix.mjs --write`
    );
    process.exitCode = 1;
};

if (
    typeof process.argv[1] === "string" &&
    fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
    await runCli();
}
