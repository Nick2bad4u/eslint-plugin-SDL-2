import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

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
            className: "sb-cat-presets",
            type: "category",
            label: "🛠️ Presets",
            link: {
                type: "doc",
                id: "presets/index",
            },
            items: [
                "presets/common",
                "presets/typescript",
                "presets/angular",
                "presets/angularjs",
                "presets/node",
                "presets/react",
                "presets/electron",
                "presets/required",
                "presets/recommended",
            ],
        },
        {
            className: "sb-cat-rules",
            type: "category",
            label: "📜 Rules",
            link: {
                type: "generated-index",
                title: "SDL Rules Reference",
                description:
                    "Rule documentation for every eslint-plugin-sdl-2 rule.",
            },
            items: [
                "no-angular-bypass-sanitizer",
                "no-angular-sanitization-trusted-urls",
                "no-angularjs-bypass-sce",
                "no-angularjs-enable-svg",
                "no-angularjs-sanitization-whitelist",
                "no-cookies",
                "no-document-domain",
                "no-document-write",
                "no-electron-node-integration",
                "no-html-method",
                "no-inner-html",
                "no-insecure-random",
                "no-insecure-url",
                "no-msapp-exec-unsafe",
                "no-postmessage-star-origin",
                "no-unsafe-alloc",
                "no-winjs-html-unsafe",
            ],
        },
    ],
};

export default sidebars;
