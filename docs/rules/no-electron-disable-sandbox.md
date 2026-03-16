# no-electron-disable-sandbox

Disallow disabling Electron renderer sandboxing in `webPreferences`.

## Targeted pattern scope

This rule targets Electron `BrowserWindow` and `BrowserView` constructor options
that set `webPreferences.sandbox` to `false`.

## What this rule reports

This rule reports `webPreferences.sandbox: false` in Electron renderer
configuration objects.

## Why this rule exists

Renderer sandboxing limits process privileges and helps contain renderer
compromise impact.

## ❌ Incorrect

```ts
new BrowserWindow({
  webPreferences: {
    sandbox: false,
  },
});
```

## ✅ Correct

```ts
new BrowserWindow({
  webPreferences: {
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
      "sdl/no-electron-disable-sandbox": "error",
    },
  },
];
```

## When not to use it

Disable only while migrating legacy renderer code, and only with explicit risk
acceptance and compensating controls.

## Package documentation

- [Rule source](../../src/rules/no-electron-disable-sandbox.ts)

## Further reading

> **Rule catalog ID:** R012

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron process sandboxing](https://www.electronjs.org/docs/latest/tutorial/sandbox)
