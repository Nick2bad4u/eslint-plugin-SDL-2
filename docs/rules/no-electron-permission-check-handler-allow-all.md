# no-electron-permission-check-handler-allow-all

Disallow Electron `setPermissionCheckHandler` callbacks that unconditionally
return `true`.

## Targeted pattern scope

This rule targets `setPermissionCheckHandler(...)` callbacks that always return
`true` for every permission check.

## What this rule reports

This rule reports inline permission check handlers that resolve to `true`
without inspecting the request context or permission name.

## Why this rule exists

Blindly approving every permission check weakens Electron's permission boundary
and can expose capabilities such as media access, notifications, and clipboard
operations to content that should not receive them.

## ❌ Incorrect

```ts
session.defaultSession.setPermissionCheckHandler(() => true);
```

## ✅ Correct

```ts
session.defaultSession.setPermissionCheckHandler(
 (_webContents, permission) => permission === "fullscreen"
);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-permission-check-handler-allow-all": "error",
  },
 },
];
```

## When not to use it

Disable only if a reviewed Electron permission policy deliberately allows every
checked permission in a constrained environment.

## Package documentation

- [Rule source](../../src/rules/no-electron-permission-check-handler-allow-all.ts)

## Further reading

> **Rule catalog ID:** R050

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron Session API](https://www.electronjs.org/docs/latest/api/session)
