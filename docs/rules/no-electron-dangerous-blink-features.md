# no-electron-dangerous-blink-features

Disallow enabling Blink runtime features through Electron `webPreferences.enableBlinkFeatures`.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.enableBlinkFeatures` to a non-empty static string.

## What this rule reports

This rule reports non-empty `enableBlinkFeatures` values in `webPreferences`
objects.

## Why this rule exists

`enableBlinkFeatures` turns on Chromium/Blink runtime feature flags. Enabling
extra features in production renderer contexts can increase attack surface and
weaken predictable browser hardening.

## ❌ Incorrect

```ts
new BrowserWindow({
  webPreferences: {
    enableBlinkFeatures: "CSSVariables,LayoutNG",
  },
});
```

## ✅ Correct

```ts
new BrowserWindow({
  webPreferences: {
    enableBlinkFeatures: "",
  },
});

new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    sandbox: true,
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
      "sdl/no-electron-dangerous-blink-features": "error",
    },
  },
];
```

## When not to use it

Disable if your application has reviewed, tightly scoped, and well-documented
Blink feature requirements with compensating security controls.

## Package documentation

- [Rule source](../../src/rules/no-electron-dangerous-blink-features.ts)

## Further reading

> **Rule catalog ID:** R010

- [Electron BrowserWindow webPreferences](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)
- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
