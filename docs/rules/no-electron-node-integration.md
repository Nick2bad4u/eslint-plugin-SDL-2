# no-electron-node-integration

Disallow enabling Electron Node.js integration for renderers with remote content.

## Targeted pattern scope

This rule targets Electron BrowserWindow and webPreferences configurations that
enable `nodeIntegration` where remote content is loaded.

## What this rule reports

This rule reports renderer configurations that combine untrusted content with
Node.js APIs.

## Why this rule exists

Enabling Node.js integration for remote content increases remote code execution
risk in Electron apps.

## ❌ Incorrect

```ts
new BrowserWindow({
 webPreferences: {
  nodeIntegration: true,
 },
});
```

## ✅ Correct

```ts
new BrowserWindow({
 webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
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
   "sdl/no-electron-node-integration": "error",
  },
 },
];
```

## When not to use it

Disable only for offline renderers with no untrusted input and compensating
controls.

## Package documentation

- [Rule source](../../src/rules/no-electron-node-integration.ts)

## Further reading

> **Rule catalog ID:** R016

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [CodeQL reference: Electron renderer Node integration](https://codeql.github.com/codeql-query-help/javascript/js-enabling-electron-renderer-node-integration/)
