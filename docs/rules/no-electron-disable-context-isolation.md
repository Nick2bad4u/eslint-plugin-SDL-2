# no-electron-disable-context-isolation

Disallow disabling Electron `webPreferences.contextIsolation`.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.contextIsolation` to `false`.

## What this rule reports

This rule reports `webPreferences.contextIsolation: false` in Electron renderer
configuration objects.

## Why this rule exists

Disabling context isolation collapses separation between preload and renderer
contexts, increasing exposure of privileged APIs.

## ❌ Incorrect

```ts
new BrowserWindow({
  webPreferences: {
    contextIsolation: false,
  },
});
```

## ✅ Correct

```ts
new BrowserWindow({
  webPreferences: {
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
      "sdl/no-electron-disable-context-isolation": "error",
    },
  },
];
```

## When not to use it

Disable only for legacy renderer code that cannot migrate yet and is protected
with strict, documented compensating controls.

## Package documentation

- [Rule source](../../src/rules/no-electron-disable-context-isolation.ts)

## Further reading

> **Rule catalog ID:** R011

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
