# no-electron-enable-webview-tag

Disallow enabling Electron `webPreferences.webviewTag`.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.webviewTag` to `true`.

## What this rule reports

This rule reports `webPreferences.webviewTag: true` in Electron renderer
configuration objects.

## Why this rule exists

Electron recommends avoiding `webview` unless absolutely necessary. Enabling the
`webviewTag` opt-in expands renderer capabilities and can make isolation harder
to reason about.

## ❌ Incorrect

```ts
new BrowserWindow({
 webPreferences: {
  webviewTag: true,
 },
});
```

## ✅ Correct

```ts
new BrowserWindow({
 webPreferences: {
  webviewTag: false,
 },
});
```

## Behavior and migration notes

This rule includes an autofix for literal boolean values.

- `webviewTag: true` is rewritten to `webviewTag: false`.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-enable-webview-tag": "error",
  },
 },
];
```

## When not to use it

Disable only if your Electron application has a reviewed webview threat model
and cannot migrate away from `webviewTag` yet.

## Package documentation

- [Rule source](../../src/rules/no-electron-enable-webview-tag.ts)

## Further reading

> **Rule catalog ID:** R047

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron `<webview>` tag](https://www.electronjs.org/docs/latest/api/webview-tag)
