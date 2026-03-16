# no-electron-insecure-permission-request-handler

Disallow Electron permission request handlers that blanket-allow permissions.

## Targeted pattern scope

Electron permission handlers that blanket-allow permission requests.

## What this rule reports

`setPermissionRequestHandler` callbacks that unconditionally `callback(true)` or return `true`.

## Why this rule exists

Blindly granting permissions can expose camera, microphone, clipboard, and notification abuse vectors.

## ❌ Incorrect

```ts
session.defaultSession.setPermissionRequestHandler(
 (wc, permission, callback) => {
  callback(true);
 }
);
```

## ✅ Correct

```ts
session.defaultSession.setPermissionRequestHandler(
 (wc, permission, callback) => {
  callback(permission === "notifications");
 }
);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-insecure-permission-request-handler": "error",
  },
 },
];
```

## When not to use it

Disable only if the runtime has a reviewed permission policy that intentionally allows a constrained set of requests.

## Package documentation

- [Rule source](../../src/rules/no-electron-insecure-permission-request-handler.ts)

## Further reading

> **Rule catalog ID:** R035

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
