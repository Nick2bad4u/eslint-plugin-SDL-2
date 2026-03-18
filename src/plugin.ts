import type { ESLint, Linter } from "eslint";

import typeScriptPlugin from "@typescript-eslint/eslint-plugin";
import typeScriptParser from "@typescript-eslint/parser";
import nodePlugin from "eslint-plugin-n";
import securityPlugin from "eslint-plugin-security";

import type { SdlConfigName } from "./_internal/config-references.js";

import packageJson from "../package.json" with { type: "json" };
import sdlRules from "./_internal/rules-registry.js";

type SdlConfig = Readonly<Linter.Config>;
type SdlConfigArray = readonly SdlConfig[];
type SdlConfigMap = Record<SdlConfigName, SdlConfigArray>;
type SdlPlugin = Readonly<ESLint.Plugin>;
type SdlPluginWithConfigs = ESLint.Plugin & {
    readonly configs: Readonly<Record<SdlConfigName, SdlConfigArray>>;
};

const typeScriptEslintPlugin = typeScriptPlugin as unknown as ESLint.Plugin;
const nodeEslintPlugin = nodePlugin as unknown as ESLint.Plugin;
const securityEslintPlugin = securityPlugin as unknown as ESLint.Plugin;

const typeScriptFiles = ["**/*.{ts,tsx,mts,cts}"];

const createAngularConfig = (plugin: SdlPlugin): SdlConfigArray => [
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "sdl/no-angular-bypass-sanitizer": "error",
            "sdl/no-angular-bypass-security-trust-html": "error",
            "sdl/no-angular-innerhtml-binding": "error",
            "sdl/no-angular-sanitization-trusted-urls": "error",
        },
    },
];

const createAngularJsConfig = (plugin: SdlPlugin): SdlConfigArray => [
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "sdl/no-angularjs-bypass-sce": "error",
            "sdl/no-angularjs-enable-svg": "error",
            "sdl/no-angularjs-ng-bind-html-without-sanitize": "error",
            "sdl/no-angularjs-sanitization-whitelist": "error",
            "sdl/no-angularjs-sce-resource-url-wildcard": "error",
        },
    },
];

const createCommonConfig = (plugin: SdlPlugin): SdlConfigArray => [
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
            "sdl/no-document-parse-html-unsafe": "error",
            "sdl/no-document-write": "error",
            "sdl/no-domparser-html-without-sanitization": "error",
            "sdl/no-html-method": "error",
            "sdl/no-iframe-srcdoc": "error",
            "sdl/no-inner-html": "error",
            "sdl/no-insecure-random": "error",
            "sdl/no-insecure-url": "error",
            "sdl/no-location-javascript-url": "error",
            "sdl/no-message-event-without-origin-check": "error",
            "sdl/no-msapp-exec-unsafe": "error",
            "sdl/no-postmessage-star-origin": "error",
            "sdl/no-postmessage-without-origin-allowlist": "error",
            "sdl/no-range-create-contextual-fragment": "error",
            "sdl/no-script-text": "error",
            "sdl/no-set-html-unsafe": "error",
            "sdl/no-window-open-without-noopener": "error",
            "sdl/no-winjs-html-unsafe": "error",
        },
    },
];

const createElectronConfig = (plugin: SdlPlugin): SdlConfigArray => [
    {
        plugins: {
            sdl: plugin,
        },
        rules: {
            "sdl/no-electron-allow-running-insecure-content": "error",
            "sdl/no-electron-dangerous-blink-features": "error",
            "sdl/no-electron-disable-context-isolation": "error",
            "sdl/no-electron-disable-sandbox": "error",
            "sdl/no-electron-disable-web-security": "error",
            "sdl/no-electron-enable-remote-module": "error",
            "sdl/no-electron-enable-webview-tag": "error",
            "sdl/no-electron-experimental-features": "error",
            "sdl/no-electron-expose-raw-ipc-renderer": "error",
            "sdl/no-electron-insecure-certificate-error-handler": "error",
            "sdl/no-electron-insecure-certificate-verify-proc": "error",
            "sdl/no-electron-insecure-permission-request-handler": "error",
            "sdl/no-electron-node-integration": "error",
            "sdl/no-electron-permission-check-handler-allow-all": "error",
            "sdl/no-electron-unchecked-ipc-sender": "error",
            "sdl/no-electron-unrestricted-navigation": "error",
            "sdl/no-electron-untrusted-open-external": "error",
            "sdl/no-electron-webview-allowpopups": "error",
            "sdl/no-electron-webview-insecure-webpreferences": "error",
            "sdl/no-electron-webview-node-integration": "error",
        },
    },
];

const createNodeConfig = (plugin: SdlPlugin): SdlConfigArray => [
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
            "sdl/no-child-process-shell-true": "error",
            "sdl/no-http-request-to-insecure-protocol": "error",
            "sdl/no-insecure-tls-agent-options": "error",
            "sdl/no-node-tls-legacy-protocol": "error",
            "sdl/no-node-tls-reject-unauthorized-zero": "error",
            "sdl/no-node-tls-security-level-zero": "error",
            "sdl/no-unsafe-alloc": "error",
        },
    },
];

const createReactConfig = (plugin: SdlPlugin): SdlConfigArray => [
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

const createTypeScriptConfig = (plugin: SdlPlugin): SdlConfigArray => [
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
            sdl: plugin,
        },
        rules: {
            "@typescript-eslint/no-implied-eval": "error",
            "no-implied-eval": "off",
            "sdl/no-nonnull-assertion-on-security-input": "error",
            "sdl/no-trusted-types-policy-pass-through": "error",
            "sdl/no-unsafe-cast-to-trusted-types": "error",
        },
    },
];

const createRequiredConfig = (
    configs: Readonly<SdlConfigMap>
): SdlConfigArray => [
    ...configs.angular,
    ...configs.angularjs,
    ...configs.common,
    ...configs.electron,
    ...configs.node,
    ...configs.react,
];

const createRecommendedConfig = (
    configs: Readonly<SdlConfigMap>
): SdlConfigArray => [
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

const pluginCore: SdlPlugin = {
    meta: {
        name: "eslint-plugin-sdl-2",
        namespace: "sdl",
        version: packageJsonVersion,
    },
    rules: sdlRules as unknown as NonNullable<ESLint.Plugin["rules"]>,
};

const configs: SdlConfigMap = {
    angular: createAngularConfig(pluginCore),
    angularjs: createAngularJsConfig(pluginCore),
    common: createCommonConfig(pluginCore),
    electron: createElectronConfig(pluginCore),
    node: createNodeConfig(pluginCore),
    react: createReactConfig(pluginCore),
    recommended: [],
    required: [],
    typescript: createTypeScriptConfig(pluginCore),
};

configs.required = createRequiredConfig(configs);
configs.recommended = createRecommendedConfig(configs);

/** ESLint plugin entrypoint with SDL rule set and flat-config presets. */
const sdlPlugin: SdlPluginWithConfigs = {
    ...pluginCore,
    configs,
    rules: sdlRules as unknown as NonNullable<ESLint.Plugin["rules"]>,
};

export default sdlPlugin;
