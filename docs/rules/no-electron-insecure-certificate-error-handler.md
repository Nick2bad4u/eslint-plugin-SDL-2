# no-electron-insecure-certificate-error-handler

Disallow Electron `certificate-error` handlers that explicitly trust invalid certificates.

## Targeted pattern scope

This rule targets `.on("certificate-error", handler)` registrations where the
handler callback is called with `true`.

## What this rule reports

This rule reports `certificate-error` handlers that invoke the callback with
`true`, which accepts invalid certificates.

## Why this rule exists

The `certificate-error` event should be handled conservatively. Calling the
callback with `true` bypasses certificate validation and can enable active
man-in-the-middle interception.

## ❌ Incorrect

```ts
app.on(
 "certificate-error",
 (_event, _webContents, _url, _error, _certificate, callback) => {
  callback(true);
 }
);
```

## ✅ Correct

```ts
app.on(
 "certificate-error",
 (_event, _webContents, _url, _error, _certificate, callback) => {
  callback(false);
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
   "sdl/no-electron-insecure-certificate-error-handler": "error",
  },
 },
];
```

## When not to use it

Disable only if your runtime deliberately implements certificate pinning or
enterprise trust logic outside this callback path and has security sign-off.

## Package documentation

- [Rule source](../../src/rules/no-electron-insecure-certificate-error-handler.ts)

## Further reading

> **Rule catalog ID:** R015

- [Electron app certificate-error event](https://www.electronjs.org/docs/latest/api/app#event-certificate-error)
- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
