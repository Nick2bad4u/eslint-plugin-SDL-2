import type { ESLint, Linter } from "eslint";

import typeScriptPlugin from "@typescript-eslint/eslint-plugin";
import typeScriptParser from "@typescript-eslint/parser";
import nodePlugin from "eslint-plugin-n";
import securityPlugin from "eslint-plugin-security";

import packageJson from "../package.json" with { type: "json" };
import {
    type SdlConfigName,
    sdlConfigNames,
} from "./_internal/config-references.js";
import { sdlRules } from "./_internal/rules-registry.js";

const typeScriptEslintPlugin = typeScriptPlugin as unknown as ESLint.Plugin;
const nodeEslintPlugin = nodePlugin as unknown as ESLint.Plugin;
const securityEslintPlugin = securityPlugin as unknown as ESLint.Plugin;

const typeScriptFiles = ["**/*.{ts,tsx,mts,cts}"] as const;

export type SdlRuleId = `sdl/${SdlRuleName}`;

export type SdlRuleName = keyof typeof sdlRules;

type SdlConfig = Readonly<Linter.Config>;

type SdlConfigArray = readonly SdlConfig[];

type SdlConfigs = Record<SdlConfigName, SdlConfigArray>;

const createAngularConfig = (plugin: ESLint.Plugin): SdlConfigArray => [
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "sdl/no-angular-bypass-sanitizer": "error",
            "sdl/no-angular-sanitization-trusted-urls": "error",
        },
    },
];

const createAngularJsConfig = (plugin: ESLint.Plugin): SdlConfigArray => [
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "sdl/no-angularjs-bypass-sce": "error",
            "sdl/no-angularjs-enable-svg": "error",
            "sdl/no-angularjs-sanitization-whitelist": "error",
        },
    },
];

const createCommonConfig = (plugin: ESLint.Plugin): SdlConfigArray => [
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "no-caller": "error",
            "no-delete-var": "error",
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-new-func": "error",
            "sdl/no-cookies": "error",
            "sdl/no-document-domain": "error",
            "sdl/no-document-write": "error",
            "sdl/no-html-method": "error",
            "sdl/no-inner-html": "error",
            "sdl/no-insecure-random": "error",
            "sdl/no-insecure-url": "error",
            "sdl/no-msapp-exec-unsafe": "error",
            "sdl/no-postmessage-star-origin": "error",
            "sdl/no-winjs-html-unsafe": "error",
        },
    },
];

const createElectronConfig = (plugin: ESLint.Plugin): SdlConfigArray => [
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "sdl/no-electron-node-integration": "error",
        },
    },
];

const createNodeConfig = (plugin: ESLint.Plugin): SdlConfigArray => [
    {
        plugins: {
            n: nodeEslintPlugin,
        },
        rules: {
            "n/no-deprecated-api": "error",
        },
    },
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "sdl/no-unsafe-alloc": "error",
        },
    },
];

const createReactConfig = (plugin: ESLint.Plugin): SdlConfigArray => [
    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
    {
        plugins: {
            sdl: plugin,
        },
    },
];

const createTypeScriptConfig = (): SdlConfigArray => [
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    },
    {
        files: [...typeScriptFiles],
        languageOptions: {
            parser: typeScriptParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": typeScriptEslintPlugin,
        },
        rules: {
            "@typescript-eslint/no-implied-eval": "error",
            "no-implied-eval": "off",
        },
    },
];

const createRequiredConfig = (configs: SdlConfigs): SdlConfigArray => [
    ...configs.angular,
    ...configs.angularjs,
    ...configs.common,
    ...configs.electron,
    ...configs.node,
    ...configs.react,
];

const createRecommendedConfig = (configs: SdlConfigs): SdlConfigArray => [
    ...configs.required,
    ...configs.typescript,
    {
        plugins: {
            security: securityEslintPlugin,
        },
    },
];

const packageJsonVersion =
    typeof packageJson.version === "string" && packageJson.version.length > 0
        ? packageJson.version
        : "0.0.0";

const pluginCore = {
    meta: {
        name: "eslint-plugin-sdl-2",
        namespace: "sdl",
        version: packageJsonVersion,
    },
    rules: sdlRules as unknown as NonNullable<ESLint.Plugin["rules"]>,
} as ESLint.Plugin;

const configs = {} as SdlConfigs;

configs.angular = createAngularConfig(pluginCore);
configs.angularjs = createAngularJsConfig(pluginCore);
configs.common = createCommonConfig(pluginCore);
configs.electron = createElectronConfig(pluginCore);
configs.node = createNodeConfig(pluginCore);
configs.react = createReactConfig(pluginCore);
configs.typescript = createTypeScriptConfig();
configs.required = createRequiredConfig(configs);
configs.recommended = createRecommendedConfig(configs);

for (const configName of sdlConfigNames) {
    if (configs[configName] === undefined) {
        throw new TypeError(`Missing SDL config '${configName}'.`);
    }
}

const sdlPlugin = {
    ...pluginCore,
    configs,
    rules: sdlRules,
} as ESLint.Plugin & {
    configs: SdlConfigs;
    rules: typeof sdlRules;
};

export type SdlConfigsMap = typeof configs;
export type SdlPlugin = typeof sdlPlugin;

export default sdlPlugin;
