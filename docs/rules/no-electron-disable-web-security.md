# no-electron-disable-web-security

Disallow disabling Electron `webPreferences.webSecurity` for renderer contexts.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.webSecurity` to `false`.

## What this rule reports

This rule reports `webPreferences.webSecurity: false` in Electron renderer
configuration objects.

## Why this rule exists

Turning off `webSecurity` removes browser-origin protections and expands the
attack surface for untrusted renderer content.

## ❌ Incorrect

```ts
new BrowserWindow({
  webPreferences: {
    webSecurity: false,
  },
});
```

## ✅ Correct

```ts
new BrowserWindow({
  webPreferences: {
    webSecurity: true,
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
      "sdl/no-electron-disable-web-security": "error",
    },
  },
];
```

## When not to use it

Disable only for tightly controlled offline renderer scenarios with explicit
compensating controls and no untrusted content.

## Package documentation

- [Rule source](../../src/rules/no-electron-disable-web-security.ts)

## Further reading

> **Rule catalog ID:** R218

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron BrowserWindow webPreferences](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)
