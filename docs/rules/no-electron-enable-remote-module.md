# no-electron-enable-remote-module

Disallow enabling Electron `webPreferences.enableRemoteModule`.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.enableRemoteModule` to `true`.

## What this rule reports

This rule reports `webPreferences.enableRemoteModule: true` in Electron
renderer configuration objects.

## Why this rule exists

Enabling the remote module expands renderer access to privileged main-process
capabilities and weakens isolation boundaries.

## ❌ Incorrect

```ts
new BrowserWindow({
  webPreferences: {
    enableRemoteModule: true,
  },
});
```

## ✅ Correct

```ts
new BrowserWindow({
  webPreferences: {
    enableRemoteModule: false,
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
      "sdl/no-electron-enable-remote-module": "error",
    },
  },
];
```

## When not to use it

Disable only for legacy Electron versions where remote cannot be removed yet,
with strict migration and deprecation plans.

## Package documentation

- [Rule source](../../src/rules/no-electron-enable-remote-module.ts)

## Further reading

> **Rule catalog ID:** R014

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron BrowserWindow webPreferences](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)
