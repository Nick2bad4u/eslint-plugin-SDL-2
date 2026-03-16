---
title: Electron preset
---

# ⚡ Electron

Use for Electron security checks around webPreferences and Node integration.

## Config key

```ts
sdl.configs.electron
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
| [`no-electron-allow-running-insecure-content`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-allow-running-insecure-content) | — |
| [`no-electron-dangerous-blink-features`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-dangerous-blink-features) | — |
| [`no-electron-disable-context-isolation`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-context-isolation) | — |
| [`no-electron-disable-sandbox`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-sandbox) | — |
| [`no-electron-disable-web-security`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-web-security) | — |
| [`no-electron-enable-remote-module`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-enable-remote-module) | — |
| [`no-electron-insecure-certificate-error-handler`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-insecure-certificate-error-handler) | — |
| [`no-electron-node-integration`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-node-integration) | — |
| [`no-electron-untrusted-open-external`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-untrusted-open-external) | — |
