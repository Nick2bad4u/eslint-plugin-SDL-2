# no-electron-allow-running-insecure-content

Disallow enabling Electron `webPreferences.allowRunningInsecureContent`.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.allowRunningInsecureContent` to `true`.

## What this rule reports

This rule reports `webPreferences.allowRunningInsecureContent: true` in Electron
renderer configuration objects.

## Why this rule exists

Allowing insecure content weakens transport guarantees and allows mixed-content
execution in renderer processes.

## ❌ Incorrect

```ts
new BrowserWindow({
  webPreferences: {
    allowRunningInsecureContent: true,
  },
});
```

## ✅ Correct

```ts
new BrowserWindow({
  webPreferences: {
    allowRunningInsecureContent: false,
  },
});
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-electron-allow-running-insecure-content": "error",
    },
  },
];
```

## When not to use it

Disable only if your renderer never loads network content and your runtime has
strict isolation controls documented outside this rule.

## Package documentation

- [Rule source](../../src/rules/no-electron-allow-running-insecure-content.ts)

## Further reading

> **Rule catalog ID:** R009

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron BrowserWindow webPreferences](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)
