# no-electron-experimental-features

Disallow enabling Electron `webPreferences.experimentalFeatures`.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.experimentalFeatures` to `true`.

## What this rule reports

This rule reports `webPreferences.experimentalFeatures: true` in Electron
renderer configuration objects.

## Why this rule exists

Electron recommends disabling experimental platform features in production
renderers because they expand the runtime surface area and can bypass hardening
assumptions.

## ❌ Incorrect

```ts
new BrowserWindow({
 webPreferences: {
  experimentalFeatures: true,
 },
});
```

## ✅ Correct

```ts
new BrowserWindow({
 webPreferences: {
  experimentalFeatures: false,
 },
});
```

## Behavior and migration notes

This rule includes an autofix for literal boolean values.

- `experimentalFeatures: true` is rewritten to `experimentalFeatures: false`.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-experimental-features": "error",
  },
 },
];
```

## When not to use it

Disable only for short-lived experiments that explicitly require Electron
experimental features and are isolated behind documented review gates.

## Package documentation

- [Rule source](../../src/rules/no-electron-experimental-features.ts)

## Further reading

> **Rule catalog ID:** R046

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron BrowserWindow webPreferences](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)
