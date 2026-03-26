import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

type RuleGroupDefinition = Readonly<{
    className: string;
    description: string;
    itemClassName: string;
    label: string;
    matches: (ruleDocId: string) => boolean;
}>;

type RuleDocCatalogEntry = Readonly<{
    catalogId: null | string;
    catalogOrder: number;
    docId: string;
    sidebarLabel: string;
}>;

type RuleSidebarDocItem = Readonly<{
    className: string;
    id: string;
    label: string;
    type: "doc";
}>;

type RuleSidebarCategoryItem = Readonly<{
    className: string;
    collapsed: boolean;
    collapsible: boolean;
    description: string;
    items: RuleSidebarDocItem[];
    label: string;
    type: "category";
}>;

const rulesDocsDirectoryPath = fileURLToPath(
    new URL("../rules", import.meta.url)
);

const ruleCatalogIdLinePattern = /^> \*\*Rule catalog ID:\*\* (R\d{3})$/mu;

const ruleLabelTokenMap: Readonly<Record<string, string>> = {
    adr: "ADR",
    angularjs: "AngularJS",
    api: "API",
    css: "CSS",
    domparser: "DOMParser",
    execcommand: "execCommand",
    html: "HTML",
    http: "HTTP",
    https: "HTTPS",
    ide: "IDE",
    ipc: "IPC",
    js: "JS",
    msapp: "MSApp",
    nodejs: "Node.js",
    noopener: "noopener",
    postmessage: "postMessage",
    sce: "SCE",
    srcdoc: "srcdoc",
    svg: "SVG",
    tls: "TLS",
    ts: "TS",
    typescript: "TypeScript",
    url: "URL",
    urls: "URLs",
    vm: "VM",
    vscode: "VS Code",
    webview: "webview",
    winjs: "WinJS",
};

const ruleGroups: readonly RuleGroupDefinition[] = [
    {
        className: "sb-cat-rules-angular",
        description: "Angular template and sanitizer safety rules.",
        itemClassName: "sb-rule-item-angular",
        label: "🅰️ Angular",
        matches: (ruleDocId) =>
            ruleDocId.startsWith("no-angular-") &&
            !ruleDocId.startsWith("no-angularjs-"),
    },
    {
        className: "sb-cat-rules-angularjs",
        description:
            "AngularJS SCE, sanitize, and legacy template safety rules.",
        itemClassName: "sb-rule-item-angularjs",
        label: "🧭 AngularJS",
        matches: (ruleDocId) => ruleDocId.startsWith("no-angularjs-"),
    },
    {
        className: "sb-cat-rules-electron",
        description:
            "Electron hardening rules for BrowserWindow and webPreferences.",
        itemClassName: "sb-rule-item-electron",
        label: "⚡ Electron",
        matches: (ruleDocId) => ruleDocId.startsWith("no-electron-"),
    },
    {
        className: "sb-cat-rules-node",
        description:
            "Node.js security rules for process execution, TLS, workers, and vm APIs.",
        itemClassName: "sb-rule-item-node",
        label: "🟩 Node.js",
        matches: (ruleDocId) =>
            ruleDocId.startsWith("no-child-process-") ||
            ruleDocId.startsWith("no-node-") ||
            ruleDocId === "no-unsafe-alloc",
    },
    {
        className: "sb-cat-rules-web",
        description:
            "Browser and web-surface security rules for DOM APIs, URLs, workers, and messaging.",
        itemClassName: "sb-rule-item-web",
        label: "🌐 Web & DOM",
        matches: (_ruleDocId) => true,
    },
];

const presetSidebarItems = [
    {
        className: "sb-doc-preset-common",
        id: "presets/common",
        label: "🟢 Common",
        type: "doc",
    },
    {
        className: "sb-doc-preset-typescript",
        id: "presets/typescript",
        label: "🔷 TypeScript",
        type: "doc",
    },
    {
        className: "sb-doc-preset-angular",
        id: "presets/angular",
        label: "🅰️ Angular",
        type: "doc",
    },
    {
        className: "sb-doc-preset-angularjs",
        id: "presets/angularjs",
        label: "🧭 AngularJS",
        type: "doc",
    },
    {
        className: "sb-doc-preset-node",
        id: "presets/node",
        label: "🟩 Node",
        type: "doc",
    },
    {
        className: "sb-doc-preset-react",
        id: "presets/react",
        label: "⚛️ React",
        type: "doc",
    },
    {
        className: "sb-doc-preset-electron",
        id: "presets/electron",
        label: "⚡ Electron",
        type: "doc",
    },
    {
        className: "sb-doc-preset-required",
        id: "presets/required",
        label: "✅ Required",
        type: "doc",
    },
    {
        className: "sb-doc-preset-recommended",
        id: "presets/recommended",
        label: "⭐ Recommended",
        type: "doc",
    },
] as const;

/**
 * Parse `R###` rule catalog id from a rule docs markdown file.
 *
 * @param markdownContent - Raw markdown file content.
 *
 * @returns Rule catalog id when present.
 */
function getRuleCatalogId(markdownContent: string): null | string {
    const match = ruleCatalogIdLinePattern.exec(markdownContent);

    if (match === null) {
        return null;
    }

    const [, catalogId] = match;

    return catalogId ?? null;
}

/**
 * Convert an optional `R###` id into numeric sort order.
 *
 * @param catalogId - Rule catalog marker.
 *
 * @returns Numeric sort order or `Infinity` when missing.
 */
function getRuleCatalogOrder(catalogId: null | string): number {
    if (catalogId === null) {
        return Number.POSITIVE_INFINITY;
    }

    const numericPart = catalogId.replace(/^R/u, "");
    const parsed = Number.parseInt(numericPart, 10);

    return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

/**
 * Convert one kebab token into a readable word for sidebar labels.
 *
 * @param token - Rule id segment token.
 *
 * @returns Display-safe token label.
 */
function formatRuleLabelToken(token: string): string {
    const mappedToken = ruleLabelTokenMap[token];

    if (mappedToken !== undefined) {
        return mappedToken;
    }

    if (/^\d+$/u.test(token)) {
        return token;
    }

    if (token.length === 0) {
        return token;
    }

    return `${token[0]?.toUpperCase() ?? ""}${token.slice(1)}`;
}

/**
 * Build a concise human-readable label from a `no-*` rule id.
 *
 * @param docId - Rule document id.
 *
 * @returns Formatted readable sidebar label text.
 */
function getReadableRuleLabel(docId: string): string {
    const slug = docId.replace(/^no-/u, "");

    return slug
        .split("-")
        .filter((token) => token.length > 0)
        .map((token) => formatRuleLabelToken(token))
        .join(" ");
}

/**
 * Return sorted rule docs metadata discovered from `docs/rules/*.md`.
 *
 * @returns Rule entries sorted by catalog id, then doc id.
 */
function getAllRuleDocEntries(): RuleDocCatalogEntry[] {
    return readdirSync(rulesDocsDirectoryPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => entry.name.replace(/\.md$/u, ""))
        .filter((docId) => docId.startsWith("no-"))
        .map((docId) => {
            const markdownPath = fileURLToPath(
                new URL(`../rules/${docId}.md`, import.meta.url)
            );
            const markdownContent = readFileSync(markdownPath, "utf8");
            const catalogId = getRuleCatalogId(markdownContent);

            return {
                catalogId,
                catalogOrder: getRuleCatalogOrder(catalogId),
                docId,
                sidebarLabel:
                    catalogId === null
                        ? getReadableRuleLabel(docId)
                        : `${catalogId} · ${getReadableRuleLabel(docId)}`,
            } satisfies RuleDocCatalogEntry;
        })
        .sort((leftEntry, rightEntry) => {
            if (leftEntry.catalogOrder !== rightEntry.catalogOrder) {
                return leftEntry.catalogOrder - rightEntry.catalogOrder;
            }

            return leftEntry.docId.localeCompare(rightEntry.docId);
        });
}

/**
 * Build grouped sidebar categories from discovered rule entries.
 *
 * @param ruleDocEntries - All available rule entries.
 *
 * @returns Sidebar category items grouped by rule family.
 */
function buildRuleGroupItems(ruleDocEntries: readonly RuleDocCatalogEntry[]) {
    const ungroupedRuleIds = new Set(
        ruleDocEntries.map((entry) => entry.docId)
    );
    const groupedItems: RuleSidebarCategoryItem[] = [];

    for (const group of ruleGroups) {
        const entriesInGroup = ruleDocEntries.filter(
            (ruleDocEntry) =>
                ungroupedRuleIds.has(ruleDocEntry.docId) &&
                group.matches(ruleDocEntry.docId)
        );

        if (entriesInGroup.length === 0) {
            continue;
        }

        for (const groupedRuleId of entriesInGroup) {
            ungroupedRuleIds.delete(groupedRuleId.docId);
        }

        const groupRuleItems: RuleSidebarDocItem[] = entriesInGroup.map(
            (ruleDocEntry) => ({
                className: `sb-rule-item ${group.itemClassName}`,
                id: ruleDocEntry.docId,
                label: ruleDocEntry.sidebarLabel,
                type: "doc",
            })
        );

        const categoryItem: RuleSidebarCategoryItem = {
            className: group.className,
            collapsed: true,
            collapsible: true,
            description: group.description,
            items: groupRuleItems,
            label: `${group.label} (${entriesInGroup.length})`,
            type: "category",
        };

        groupedItems.push(categoryItem);
    }

    const remainingRuleEntries = ruleDocEntries
        .filter((entry) => ungroupedRuleIds.has(entry.docId))
        .sort((left, right) => {
            if (left.catalogOrder !== right.catalogOrder) {
                return left.catalogOrder - right.catalogOrder;
            }

            return left.docId.localeCompare(right.docId);
        });

    const remainingRuleItems: RuleSidebarDocItem[] = remainingRuleEntries.map(
        (ruleDocEntry) => ({
            className: "sb-rule-item sb-rule-item-misc",
            id: ruleDocEntry.docId,
            label: ruleDocEntry.sidebarLabel,
            type: "doc",
        })
    );

    if (remainingRuleItems.length > 0) {
        const categoryItem: RuleSidebarCategoryItem = {
            className: "sb-cat-rules-misc",
            collapsed: true,
            collapsible: true,
            description:
                "Additional SDL rules that do not map to a primary family.",
            items: remainingRuleItems,
            label: `🧩 Additional Rules (${remainingRuleItems.length})`,
            type: "category",
        };

        groupedItems.push(categoryItem);
    }

    return groupedItems;
}

const ruleDocEntries = getAllRuleDocEntries();
const groupedRuleItems = buildRuleGroupItems(ruleDocEntries);

const sidebars: SidebarsConfig = {
    rules: [
        {
            className: "sb-doc-overview",
            id: "overview",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            className: "sb-doc-getting-started",
            id: "getting-started",
            label: "🚀 Getting Started",
            type: "doc",
        },
        {
            className: "sb-cat-rule-navigation",
            collapsed: false,
            collapsible: true,
            description:
                "Quick links across rule docs, presets, and contributor documentation.",
            items: [
                {
                    className: "sb-doc-rule-nav-overview",
                    id: "overview",
                    label: "🏁 Rules overview",
                    type: "doc",
                },
                {
                    className: "sb-doc-rule-nav-start",
                    id: "getting-started",
                    label: "🚀 Setup and adoption",
                    type: "doc",
                },
                {
                    className: "sb-doc-rule-nav-presets",
                    id: "presets/index",
                    label: "🛠️ Preset index",
                    type: "doc",
                },
                {
                    href: "/docs/developer",
                    label: "🧑‍💻 Developer docs",
                    type: "link",
                },
                {
                    href: "/docs/developer/api",
                    label: "📘 API docs",
                    type: "link",
                },
            ],
            label: "🧭 Navigation",
            type: "category",
        },
        {
            className: "sb-cat-presets",
            items: [...presetSidebarItems],
            label: `🛠️ Presets (${presetSidebarItems.length})`,
            link: {
                id: "presets/index",
                type: "doc",
            },
            type: "category",
        },
        {
            className: "sb-cat-rules",
            items: groupedRuleItems,
            label: `📜 Rules (${ruleDocEntries.length})`,
            link: {
                description:
                    "Rule documentation for every eslint-plugin-sdl-2 rule.",
                title: "SDL Rules Reference",
                type: "generated-index",
            },
            type: "category",
        },
    ],
};

export default sidebars;
