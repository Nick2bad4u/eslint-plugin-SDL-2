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

| Rule                                                                                                                       | Fix |
| -------------------------------------------------------------------------------------------------------------------------- | :-: |
| [`no-electron-node-integration`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-node-integration) |  —  |
