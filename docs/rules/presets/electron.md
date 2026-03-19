---
title: Electron preset
---

# ⚡ Electron

Use for Electron security checks around webPreferences and Node integration.

## Config key

```ts
sdl.configs.electron;
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.electron];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`no-electron-allow-running-insecure-content`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-allow-running-insecure-content) | 🔧 |
| [`no-electron-dangerous-blink-features`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-dangerous-blink-features) | — |
| [`no-electron-disable-context-isolation`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-disable-context-isolation) | 🔧 |
| [`no-electron-disable-sandbox`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-disable-sandbox) | 🔧 |
| [`no-electron-disable-web-security`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-disable-web-security) | 🔧 |
| [`no-electron-enable-remote-module`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-enable-remote-module) | 🔧 |
| [`no-electron-enable-webview-tag`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-enable-webview-tag) | 🔧 |
| [`no-electron-experimental-features`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-experimental-features) | 🔧 |
| [`no-electron-expose-raw-ipc-renderer`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-expose-raw-ipc-renderer) | — |
| [`no-electron-insecure-certificate-error-handler`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-insecure-certificate-error-handler) | — |
| [`no-electron-insecure-certificate-verify-proc`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-insecure-certificate-verify-proc) | — |
| [`no-electron-insecure-permission-request-handler`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-insecure-permission-request-handler) | — |
| [`no-electron-node-integration`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-node-integration) | 🔧 |
| [`no-electron-permission-check-handler-allow-all`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-permission-check-handler-allow-all) | — |
| [`no-electron-unchecked-ipc-sender`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-unchecked-ipc-sender) | — |
| [`no-electron-unrestricted-navigation`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-unrestricted-navigation) | — |
| [`no-electron-untrusted-open-external`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-untrusted-open-external) | — |
| [`no-electron-webview-allowpopups`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-webview-allowpopups) | 🔧 |
| [`no-electron-webview-insecure-webpreferences`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-webview-insecure-webpreferences) | — |
| [`no-electron-webview-node-integration`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-electron-webview-node-integration) | 🔧 |
