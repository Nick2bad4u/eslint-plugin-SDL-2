/**
 * @packageDocumentation
 * Sidebar structure for the primary documentation section under `docs/`.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const repositoryOwner = "Nick2bad4u";
const repositoryName = "eslint-plugin-SDL-2";
const repositoryBaseUrl = `https://github.com/${repositoryOwner}/${repositoryName}`;
const developerDocsDirectoryPath = fileURLToPath(
    new URL("./site-docs/developer", import.meta.url)
);

type DeveloperGuideDocEntry = Readonly<{
    className: string;
    docId: string;
    label: string;
    sidebarPosition: number;
}>;

type DeveloperGuideSidebarItem = Readonly<{
    className: string;
    id: string;
    label: string;
    type: "doc";
}>;

const developerGuideClassNameByDocId: Readonly<Record<string, string>> = {
    "developer/cli-debugging-and-print-config": "sb-doc-dev-guide-cli",
    "developer/ide-integration-vscode": "sb-doc-dev-guide-ide",
    "developer/maintainer-stats-and-performance":
        "sb-doc-dev-guide-performance",
    "developer/node-api-usage": "sb-doc-dev-guide-node-api",
};

const developerGuideIconByDocId: Readonly<Record<string, string>> = {
    "developer/cli-debugging-and-print-config": "🧪",
    "developer/ide-integration-vscode": "🧰",
    "developer/maintainer-stats-and-performance": "📈",
    "developer/node-api-usage": "🟩",
};

const developerGuidesExcludedDocIds = new Set(["developer/typed-paths"]);

/**
 * Read a frontmatter scalar value with optional surrounding quotes.
 *
 * @param markdownContent - Raw markdown file content.
 * @param fieldName - Frontmatter field to read.
 *
 * @returns Parsed frontmatter value when present.
 */
function readFrontmatterStringField(
    markdownContent: string,
    fieldName: string
): null | string {
    const pattern = new RegExp(`^${fieldName}:\\s*(.+)$`, "mu");
    const match = pattern.exec(markdownContent);

    if (match === null) {
        return null;
    }

    const [, rawValue] = match;

    if (rawValue === undefined) {
        return null;
    }

    return rawValue.trim().replace(/^(["'])(.*)\1$/u, "$2");
}

/**
 * Build dynamic maintainer-guide entries from top-level developer docs.
 *
 * @returns Sorted maintainer guide docs for sidebar rendering.
 */
function getDeveloperGuideDocEntries(): DeveloperGuideDocEntry[] {
    return readdirSync(developerDocsDirectoryPath, { withFileTypes: true })
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith(".md") &&
                entry.name !== "index.md"
        )
        .map((entry) => {
            const docFileStem = entry.name.replace(/\.md$/u, "");
            const docId = `developer/${docFileStem}`;

            return {
                docFileStem,
                docId,
            };
        })
        .filter((entry) => !developerGuidesExcludedDocIds.has(entry.docId))
        .map((entry) => {
            const markdownPath = fileURLToPath(
                new URL(`./site-docs/${entry.docId}.md`, import.meta.url)
            );
            const markdownContent = readFileSync(markdownPath, "utf8");
            const title =
                readFrontmatterStringField(markdownContent, "title") ??
                entry.docFileStem;
            const sidebarPositionRaw = readFrontmatterStringField(
                markdownContent,
                "sidebar_position"
            );
            const sidebarPosition =
                sidebarPositionRaw === null
                    ? Number.POSITIVE_INFINITY
                    : Number.parseInt(sidebarPositionRaw, 10);
            const icon = developerGuideIconByDocId[entry.docId] ?? "📄";

            return {
                className:
                    developerGuideClassNameByDocId[entry.docId] ??
                    "sb-doc-dev-guide-generic",
                docId: entry.docId,
                label: `${icon} ${title}`,
                sidebarPosition: Number.isNaN(sidebarPosition)
                    ? Number.POSITIVE_INFINITY
                    : sidebarPosition,
            } satisfies DeveloperGuideDocEntry;
        })
        .sort((leftEntry, rightEntry) => {
            if (leftEntry.sidebarPosition !== rightEntry.sidebarPosition) {
                return leftEntry.sidebarPosition - rightEntry.sidebarPosition;
            }

            return leftEntry.label.localeCompare(rightEntry.label);
        });
}

/**
 * Read doc ids for a `site-docs/developer/<folderName>` folder.
 *
 * @param folderName - Developer subfolder name.
 *
 * @returns Sorted doc ids excluding `index.md`.
 */
function getDeveloperSubfolderDocIds(folderName: "adr" | "charts"): string[] {
    const folderPath = fileURLToPath(
        new URL(`./site-docs/developer/${folderName}`, import.meta.url)
    );

    return readdirSync(folderPath, { withFileTypes: true })
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith(".md") &&
                entry.name !== "index.md"
        )
        .map((entry) => {
            const docFileStem = entry.name.replace(/\.md$/u, "");
            const normalizedDocStem = docFileStem.replace(/^\d{4}-/u, "");

            return `developer/${folderName}/${normalizedDocStem}`;
        })
        .sort((leftId, rightId) => leftId.localeCompare(rightId));
}

const developerAdrDocIds = getDeveloperSubfolderDocIds("adr");
const developerChartDocIds = getDeveloperSubfolderDocIds("charts");
const developerGuideDocEntries = getDeveloperGuideDocEntries();
const developerGuideSidebarItems: DeveloperGuideSidebarItem[] =
    developerGuideDocEntries.map((entry) => ({
        className: entry.className,
        id: entry.docId,
        label: entry.label,
        type: "doc",
    }));

const sidebars = {
    docs: [
        {
            className: "sb-cat-developer",
            id: "developer/index",
            label: "🧑‍💻 Dev",
            type: "doc",
        },
        {
            className: "sb-cat-api-overview",
            collapsed: true,
            collapsible: true,
            customProps: {
                badge: "api-overview",
            },
            description:
                "Entry point for generated API docs and typed-path service inventory notes.",
            items: [
                {
                    className: "sb-api-overview-item",
                    id: "developer/api/plugin/index",
                    label: "🧩 Plugin API index",
                    type: "doc",
                },
                {
                    className: "sb-api-overview-item",
                    id: "developer/typed-paths",
                    label: "🧬 Typed paths inventory",
                    type: "doc",
                },
                {
                    className: "sb-api-overview-item",
                    id: "developer/api/plugin/type-aliases/SdlPluginWithConfigs",
                    label: "🧠 Type aliases · SdlPluginWithConfigs",
                    type: "doc",
                },
                {
                    className: "sb-api-overview-item",
                    id: "developer/api/plugin/variables/sdlPlugin",
                    label: "⚙️ Runtime exports · sdlPlugin",
                    type: "doc",
                },
            ],
            label: "📘 API Overview",
            link: {
                id: "developer/api/index",
                type: "doc",
            },
            type: "category",
        },
        {
            className: "sb-cat-dev-guides",
            collapsed: true,
            collapsible: true,
            customProps: {
                badge: "guides",
            },
            description:
                "Operational and maintainer workflows for debugging, profiling, IDE support, and Node API integration.",
            items: developerGuideSidebarItems,
            label: `🛠️ Maintainer Guides (${developerGuideDocEntries.length})`,
            link: {
                description:
                    "Operational guides for maintainers and advanced contributors.",
                title: "Maintainer Guides",
                type: "generated-index",
            },
            type: "category",
        },
        {
            className: "sb-cat-developer-adr",
            collapsed: true,
            customProps: {
                badge: "adr",
            },
            items: developerAdrDocIds,
            label: `🧭 Architecture Decisions (${developerAdrDocIds.length})`,
            collapsible: true,
            description:
                "Architectural decisions and design rationale for eslint-plugin-sdl-2.",
            link: {
                id: "developer/adr/index",
                type: "doc",
            },
            type: "category",
        },
        {
            className: "sb-cat-dev-charts",
            collapsed: true,
            customProps: {
                badge: "charts",
            },
            items: developerChartDocIds,
            label: `📊 Charts (${developerChartDocIds.length})`,
            collapsible: true,
            description:
                "Visual aids for understanding plugin architecture, processes, and policies.",
            link: {
                id: "developer/charts/index",
                type: "doc",
            },
            type: "category",
        },
        {
            className: "sb-cat-api-types",
            collapsed: true,
            collapsible: true,
            description:
                "Type-level contracts and shared type aliases exposed by the plugin.",
            customProps: {
                badge: "types",
            },
            items: [
                {
                    dirName: "developer/api/plugin/type-aliases",
                    type: "autogenerated",
                },
            ],
            label: "Types",
            link: {
                description:
                    "Type-level contracts and shared type aliases exposed by the plugin.",
                title: "Type Aliases",
                type: "generated-index",
            },
            type: "category",
        },
        {
            className: "sb-cat-api-runtime",
            collapsed: true,
            collapsible: true,
            description:
                "Runtime API references for rule authoring and plugin extension.",
            customProps: {
                badge: "runtime",
            },
            items: [
                {
                    collapsed: true,
                    collapsible: true,
                    items: [
                        {
                            dirName: "developer/api/plugin/variables",
                            type: "autogenerated",
                        },
                    ],
                    label: "Plugin variables",
                    type: "category",
                },
                {
                    collapsed: true,
                    collapsible: true,
                    items: [
                        {
                            dirName: "developer/api/internal",
                            type: "autogenerated",
                        },
                    ],
                    label: "Internal API",
                    type: "category",
                },
            ],
            label: "Runtime",
            link: {
                description:
                    "Runtime exports and internal utility API references from eslint-plugin-sdl-2.",
                title: "Runtime Exports",
                type: "generated-index",
            },
            type: "category",
        },
        {
            className: "sb-cat-dev-links",
            collapsed: true,
            collapsible: true,
            customProps: {
                badge: "links",
            },
            description:
                "Project resources, release notes, blog posts, and issue tracker links.",
            items: [
                {
                    href: "/docs/rules/overview",
                    label: "📜 Rules overview",
                    type: "link",
                },
                {
                    href: "/docs/rules/presets",
                    label: "🛠️ Preset reference",
                    type: "link",
                },
                {
                    href: "/docs/rules/getting-started",
                    label: "🚀 Rules getting started",
                    type: "link",
                },
                {
                    href: repositoryBaseUrl,
                    label: "\ue709 GitHub repository",
                    type: "link",
                },
                {
                    href: "https://www.npmjs.com/package/eslint-plugin-sdl-2",
                    label: "\ue616 npm package",
                    type: "link",
                },
                {
                    href: `${repositoryBaseUrl}/releases`,
                    label: "\ueb09 Releases",
                    type: "link",
                },
                {
                    href: `${repositoryBaseUrl}/blob/main/CHANGELOG.md`,
                    label: "📝 Changelog",
                    type: "link",
                },
                {
                    href: `${repositoryBaseUrl}/blob/main/CONTRIBUTING.md`,
                    label: "\uf0c0 Contributing guide",
                    type: "link",
                },
                {
                    href: `${repositoryBaseUrl}/blob/main/SECURITY.md`,
                    label: "🔐 Security policy",
                    type: "link",
                },
                {
                    href: "/blog",
                    label: "📰 Blog posts",
                    type: "link",
                },
                {
                    href: "/blog/archive",
                    label: "🗂 Blog archive",
                    type: "link",
                },
                {
                    href: `${repositoryBaseUrl}/issues?q=is%3Aissue%20is%3Aopen`,
                    label: "🐛 Open issues",
                    type: "link",
                },
            ],
            label: "🌐 Links",
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
