import { themes as prismThemes } from "prism-react-renderer";

import type { Config, PluginModule } from "@docusaurus/types";
import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type * as Preset from "@docusaurus/preset-classic";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

/** Route base path where docs site is deployed (GitHub Pages project path). */
const baseUrl = process.env["DOCUSAURUS_BASE_URL"] ?? "/eslint-plugin-SDL-2/";
/** Canonical deployed docs root URL used for absolute project tool links. */
const deployedDocsRootUrl = `https://nick2bad4u.github.io${baseUrl}`;
/** Public origin for the published documentation site. */
const siteOrigin = "https://nick2bad4u.github.io";
/** Canonical public site URL including the GitHub Pages project path. */
const siteUrl = `${siteOrigin}${baseUrl}`;
/** Global site description used for SEO and social cards. */
const siteDescription =
    "Security-focused ESLint rules and flat-config presets for SDL-first codebases.";
/** Social preview image path relative to the static directory. */
const socialCardImagePath = "img/logo.png";
/** Absolute social preview image URL. */
const socialCardImageUrl = new URL(socialCardImagePath, siteUrl).toString();
/** Opt-in flag for experimental Docusaurus performance features. */
const enableExperimentalFaster =
    process.env["DOCUSAURUS_ENABLE_EXPERIMENTAL"] === "true";

/** GitHub organization used for edit links and project metadata. */
const organizationName = "Nick2bad4u";
/** Repository name used for edit links and project metadata. */
const projectName = "eslint-plugin-SDL-2";
/** Client module path for runtime DOM enhancement bootstrap script. */
const modernEnhancementsClientModule = fileURLToPath(
    new URL("src/js/modernEnhancements.ts", import.meta.url)
);

/** PWA theme-color meta value for Chromium-based browsers. */
const pwaThemeColor = "#120f1f";
/** Windows tile color for pinned-site metadata. */
const pwaTileColor = "#120f1f";
/** Safari pinned-tab mask icon color. */
const pwaMaskIconColor = "#8b5cf6";
/** Local require helper rooted at the docs workspace config file location. */
const requireFromDocsWorkspace = createRequire(import.meta.url);

/** Resolve an optional module specifier without throwing when absent. */
const resolveOptionalModule = (moduleSpecifier: string): string | undefined => {
    try {
        return requireFromDocsWorkspace.resolve(moduleSpecifier);
    } catch {
        return undefined;
    }
};

/**
 * Optional ESM entry used to avoid webpack warnings from VS Code CSS language
 * service packages.
 */
const vscodeCssLanguageServiceEsmEntry = resolveOptionalModule(
    "vscode-css-languageservice/lib/esm/cssLanguageService.js"
);
/**
 * Optional ESM entry used to avoid webpack warnings from VS Code language
 * server type packages.
 */
const vscodeLanguageServerTypesEsmEntry = resolveOptionalModule(
    "vscode-languageserver-types/lib/esm/main.js"
);

/**
 * Alias VS Code language-service packages to their ESM entries when they are
 * present.
 *
 * @remarks
 * Some transitive editor-style dependencies resolve the UMD build of
 * `vscode-languageserver-types`, which causes noisy webpack critical-dependency
 * warnings inside Docusaurus. This plugin only activates when those optional
 * packages are actually installed in the current workspace.
 */
const suppressKnownWebpackWarningsPlugin: PluginModule = () => {
    return {
        configureWebpack() {
            return {
                ignoreWarnings: [
                    /**
                     * Suppress the known webpack critical-dependency warning
                     * emitted by the UMD build of vscode-languageserver-types.
                     *
                     * We already alias to the ESM entry when available, but
                     * some transitive resolution paths still surface the UMD
                     * warning during docs builds. This is third-party noise,
                     * not a site-level problem.
                     */
                    (warning: unknown) => {
                        const warningRecord = warning as
                            | Readonly<Record<string, unknown>>
                            | undefined;
                        const warningMessage = warningRecord?.["message"];

                        return (
                            typeof warningMessage === "string" &&
                            warningMessage.includes(
                                "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
                            )
                        );
                    },
                ],
                resolve: {
                    alias: {
                        ...(vscodeCssLanguageServiceEsmEntry === undefined
                            ? {}
                            : {
                                  "vscode-css-languageservice$":
                                      vscodeCssLanguageServiceEsmEntry,
                              }),
                        ...(vscodeLanguageServerTypesEsmEntry === undefined
                            ? {}
                            : {
                                  "vscode-languageserver-types$":
                                      vscodeLanguageServerTypesEsmEntry,
                                  "vscode-languageserver-types/lib/umd/main.js$":
                                      vscodeLanguageServerTypesEsmEntry,
                              }),
                    },
                },
            };
        },
        name: "suppress-known-webpack-warnings",
    };
};

/** Footer copyright HTML used by the site theme config. */
const footerCopyright =
    `© ${new Date().getFullYear()} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> 💻 Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">🦖 Docusaurus</a>.';

/** Obfuscated key for the v4 legacy post-build head attribute removal flag. */
const removeHeadAttrFlagKey = [
    "remove",
    "Le",
    "gacyPostBuildHeadAttribute",
].join("");

/** Docusaurus future flags, including optional experimental fast path. */
const futureConfig = {
    ...(enableExperimentalFaster
        ? {
              faster: {
                  mdxCrossCompilerCache: true,
                  rspackBundler: true,
                  rspackPersistentCache: true,
                  ssgWorkerThreads: true,
              },
          }
        : {}),
    v4: {
        [removeHeadAttrFlagKey]: true,
        // NOTE: Enabling cascade layers currently breaks our production CSS output
        // (CssMinimizer parsing errors -> large chunks of CSS dropped), which
        // makes many Infima (--ifm-*) variables undefined across the site.
        // Re-enable only after verifying the build output CSS is valid.
        useCssCascadeLayers: false,
        siteStorageNamespacing: true,
        fasterByDefault: true,
        removeLegacyPostBuildHeadAttribute: true,
        mdx1CompatDisabledByDefault: true,
    },
} satisfies Config["future"];

/** Full Docusaurus site configuration exported to the build/runtime. */
const config = {
    baseUrl,
    baseUrlIssueBanner: true,
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.svg",
    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: futureConfig,
    clientModules: [modernEnhancementsClientModule],
    headTags: [
        // Preconnect to GitHub for faster resource loading
        {
            attributes: { href: siteOrigin, rel: "preconnect" },
            tagName: "link",
        },
        {
            attributes: { href: "https://github.com", rel: "preconnect" },
            tagName: "link",
        },
        // JSON-LD structured data for rich search results
        {
            attributes: { type: "application/ld+json" },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                applicationCategory: "DeveloperApplication",
                author: {
                    "@type": "Person",
                    name: organizationName,
                    url: `https://github.com/${organizationName}`,
                },
                description: siteDescription,
                image: socialCardImageUrl,
                license: "https://opensource.org/licenses/MIT",
                name: projectName,
                operatingSystem: "Any",
                url: siteUrl,
            }),
            tagName: "script",
        },
    ],
    storage: {
        namespace: true,
        type: "localStorage",
    },
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        anchors: {
            maintainCase: true,
        },
        emoji: true,
        format: "detect",
        hooks: {
            onBrokenMarkdownImages: "warn",
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    noIndex: false,
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
    organizationName,
    plugins: [
        suppressKnownWebpackWarningsPlugin,
        "docusaurus-plugin-image-zoom",
        [
            "@docusaurus/plugin-pwa",
            {
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "standalone",
                    "queryString",
                ],
                pwaHead: [
                    {
                        href: `${baseUrl}manifest.json`,
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: pwaThemeColor,
                        name: "theme-color",
                        tagName: "meta",
                    },
                    {
                        content: "yes",
                        name: "apple-mobile-web-app-capable",
                        tagName: "meta",
                    },
                    {
                        content: "default",
                        name: "apple-mobile-web-app-status-bar-style",
                        tagName: "meta",
                    },
                    {
                        href: `${baseUrl}img/apple-touch-icon.png`,
                        rel: "apple-touch-icon",
                        tagName: "link",
                    },
                    {
                        color: pwaMaskIconColor,
                        href: `${baseUrl}img/icon-512.svg`,
                        rel: "mask-icon",
                        tagName: "link",
                    },
                    {
                        content: `${baseUrl}img/web-app-manifest-192x192.png`,
                        name: "msapplication-TileImage",
                        tagName: "meta",
                    },
                    {
                        content: pwaTileColor,
                        name: "msapplication-TileColor",
                        tagName: "meta",
                    },
                ],
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                sidebarPath: "./sidebars.rules.ts",
            } satisfies DocsPluginOptions,
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: {
                    blogDescription:
                        "Updates, architecture notes, and practical guidance for eslint-plugin-SDL-2 users.",
                    blogSidebarCount: "ALL",
                    blogSidebarTitle: "All posts",
                    blogTitle: "eslint-plugin-SDL-2 Blog",
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    feedOptions: {
                        copyright: footerCopyright,
                        description:
                            "Updates, architecture notes, and practical guidance for eslint-plugin-SDL-2 users.",
                        language: "en",
                        title: "eslint-plugin-SDL-2 Blog",
                        type: ["rss", "atom"],
                        xslt: true,
                    },
                    onInlineAuthors: "warn",
                    onInlineTags: "warn",
                    onUntruncatedBlogPosts: "warn",
                    path: "blog",
                    postsPerPage: 10,
                    routeBasePath: "blog",
                    showReadingTime: true,
                },
                docs: {
                    breadcrumbs: true,
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    path: "site-docs",
                    includeCurrentVersion: true,
                    onInlineTags: "ignore",
                    routeBasePath: "docs",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    sidebarCollapsed: true,
                    sidebarCollapsible: true,
                    sidebarPath: "./sidebars.ts",
                },
                googleTagManager: {
                    containerId: "GTM-T8J6HPLF",
                },
                gtag: {
                    trackingID: "G-18DR1S6R1T",
                },
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: [
                        // Declarations (often generated next to CSS modules)
                        // must never become routable pages.
                        "**/*.d.ts",
                        "**/*.d.tsx",
                        "**/__tests__/**",
                        "**/*.test.{js,jsx,ts,tsx}",
                        "**/*.spec.{js,jsx,ts,tsx}",
                    ],
                    include: ["**/*.{js,jsx,ts,tsx,md,mdx}"],
                    mdxPageComponent: "@theme/MDXPage",
                    path: "src/pages",
                    routeBasePath: "/",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },
                sitemap: {
                    filename: "sitemap.xml",
                    ignorePatterns: ["/tests/**"],
                    lastmod: "datetime",
                },
                svgr: {
                    svgrConfig: {
                        dimensions: false, // Remove width/height so CSS controls size
                        expandProps: "start", // Spread props at the start: <svg {...props}>
                        icon: true, // Treat SVGs as icons (scales via viewBox)
                        memo: true, // Wrap component with React.memo
                        native: false, // Produce web React components (not React Native)
                        prettier: true, // Run Prettier on output
                        prettierConfig: "../../.prettierrc",
                        replaceAttrValues: {
                            "#000": "currentColor",
                            "#000000": "currentColor",
                        }, // Inherit color
                        svgo: true, // Enable SVGO optimizations
                        svgoConfig: {
                            plugins: [
                                { active: false, name: "removeViewBox" }, // Keep viewBox for scalability
                            ],
                        },
                        svgProps: { focusable: "false", role: "img" }, // Default SVG props
                        titleProp: true, // Allow passing a title prop for accessibility
                        typescript: true, // Generate TypeScript-friendly output (.tsx)
                    },
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    tagline:
        "Security-focused ESLint rules and flat-config presets for SDL-first codebases.",
    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        metadata: [
            {
                content:
                    "eslint, eslint-plugin, security, sdl, typescript, linting, static analysis, code quality",
                name: "keywords",
            },
            {
                content: siteDescription,
                name: "description",
            },
        ],
        footer: {
            copyright: footerCopyright,
            links: [
                {
                    items: [
                        {
                            label: "🏁 Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "📖 Getting Started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "🛠️ Presets",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "📏 Rule Reference",
                            to: "/docs/rules/no-insecure-url",
                        },
                    ],
                    title: "📚 Explore",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "\ueb09 Releases",
                        },
                        {
                            href: `${deployedDocsRootUrl}eslint-inspector/`,
                            label: "\ue7d2 ESLint Inspector",
                        },
                        {
                            href: `${deployedDocsRootUrl}stylelint-inspector/`,
                            label: "\ue7d2 Stylelint Inspector",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "\uf113 NPM package",
                        },
                    ],
                    title: "📁 Project",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "\uea84 GitHub Repository",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/issues`,
                            label: "\uf188 Report Issues",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "\ue616 NPM",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/blob/main/CONTRIBUTING.md`,
                            label: "\uf0c0 Contributing",
                        },
                    ],
                    title: "⚙️ Support",
                },
            ],
            logo: {
                alt: "eslint-plugin-SDL-2 logo",
                href: `https://github.com/${organizationName}/${projectName}`,
                src: "img/logo.svg",
                width: 60,
                height: 60,
            },
            style: "dark",
        },
        image: "img/logo.png",
        navbar: {
            style: "dark",
            hideOnScroll: true,
            items: [
                {
                    activeBaseRegex: "^/docs/rules/overview/?$",
                    label: "📚 Docs",
                    position: "left",
                    to: "/docs/rules/overview",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "• Getting Started",
                            to: "/docs/rules/getting-started",
                        },
                    ],
                },
                {
                    activeBaseRegex: "^/docs/rules(?:/(?!presets(?:/|$)).*)?$",
                    label: "📜 Rules",
                    position: "left",
                    to: "/docs/rules/no-insecure-url",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Rule Reference",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "🅰️ Angular",
                            to: "/docs/rules/no-angular-bypass-sanitizer",
                        },
                        {
                            label: "🧭 AngularJS",
                            to: "/docs/rules/no-angularjs-bypass-sce",
                        },
                        {
                            label: "🟢 Browser",
                            to: "/docs/rules/no-insecure-url",
                        },
                        {
                            label: "⚡ Runtime",
                            to: "/docs/rules/no-unsafe-alloc",
                        },
                    ],
                },
                {
                    activeBaseRegex: "^/docs/rules/presets(?:/.*)?$",
                    label: "🛠️ Presets",
                    position: "left",
                    to: "/docs/rules/presets",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Preset Reference",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "🟢 Common",
                            to: "/docs/rules/presets/common",
                        },
                        {
                            label: "🔷 TypeScript",
                            to: "/docs/rules/presets/typescript",
                        },
                        {
                            label: "🅰️ Angular",
                            to: "/docs/rules/presets/angular",
                        },
                        {
                            label: "🧭 AngularJS",
                            to: "/docs/rules/presets/angularjs",
                        },
                        {
                            label: "🟩 Node",
                            to: "/docs/rules/presets/node",
                        },
                        {
                            label: "⚛️ React",
                            to: "/docs/rules/presets/react",
                        },
                        {
                            label: "⚡ Electron",
                            to: "/docs/rules/presets/electron",
                        },
                        {
                            label: "✅ Required",
                            to: "/docs/rules/presets/required",
                        },
                        {
                            label: "⭐ Recommended",
                            to: "/docs/rules/presets/recommended",
                        },
                    ],
                },
                {
                    label: "\udb80\ude19 Dev",
                    position: "right",
                    to: "/docs/developer",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Development Guide",
                            to: "/docs/developer",
                        },
                        {
                            label: "• API Reference",
                            to: "/docs/developer/api",
                        },
                        {
                            label: "• ADRs",
                            to: "/docs/developer/adr",
                        },
                        {
                            label: "• Types",
                            to: "/docs/category/types",
                        },
                        {
                            label: "• Charts",
                            to: "/docs/developer/charts",
                        },
                        {
                            label: "• Internals",
                            to: "/docs/category/runtime",
                        },
                    ],
                },
                {
                    label: "\ueaa4 Blog",
                    position: "right",
                    to: "/blog",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Latest Posts",
                            to: "/blog",
                        },
                        {
                            label: "• All Posts",
                            to: "/blog/archive",
                        },
                    ],
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "\ue65b GitHub",
                    position: "right",
                    type: "dropdown",
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "• \ue709 GitHub",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "• \ue616 NPM",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            className: "navbar-dropdown-divider-before",
                            label: "• Releases",
                        },
                    ],
                },
            ],
            logo: {
                alt: "eslint-plugin-SDL-2 logo",
                height: 48,
                href: baseUrl,
                src: "img/logo.svg",
                width: 48,
            },
            title: "eslint-plugin-SDL-2",
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "yaml",
                "typescript",
            ],
            darkTheme: prismThemes.dracula,
            defaultLanguage: "typescript",
            theme: prismThemes.github,
        },
        tableOfContents: {
            maxHeadingLevel: 4,
            minHeadingLevel: 2,
        },
        zoom: {
            background: {
                dark: "rgb(50, 50, 50)",
                light: "rgb(255, 255, 255)",
            },
            config: {
                // Options you can specify via https://github.com/francoischalifour/medium-zoom#usage
            },
            selector: ".markdown > img",
        },
    } satisfies Preset.ThemeConfig,
    themes: [
        "@docusaurus/theme-mermaid",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                blogDir: "blog",
                blogRouteBasePath: "blog",
                docsDir: "docs",
                docsRouteBasePath: "docs",
                explicitSearchResultPath: false,
                forceIgnoreNoIndex: true,
                fuzzyMatchingDistance: 1,
                hashed: true,
                hideSearchBarWithNoSearchContext: false,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: true,
                indexDocs: true,
                indexPages: false,
                language: ["en"],
                removeDefaultStemmer: true,
                removeDefaultStopWordFilter: false,
                searchBarPosition: "right",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarShortcutKeymap: "ctrl+k",
                searchResultContextMaxLength: 96,
                searchResultLimits: 8,
                useAllContextsWithNoSearchContext: false,
            },
        ],
    ],
    title: "eslint-plugin-SDL-2",
    trailingSlash: false,
    url: "https://nick2bad4u.github.io",
} satisfies Config;

export default config;
