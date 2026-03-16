# no-electron-unrestricted-navigation

Disallow Electron navigation handlers that allow unrestricted navigation or window creation.

## Targeted pattern scope

Electron navigation/open handlers that allow unrestricted navigation behavior.

## What this rule reports

`setWindowOpenHandler` returning allow, or `will-navigate` handlers that do not block by default.

## Why this rule exists

Unrestricted navigation can enable tabnabbing, phishing surfaces, and privilege-boundary bypasses.

## ❌ Incorrect

```ts
contents.setWindowOpenHandler(() => ({ action: "allow" }));
```

## ✅ Correct

```ts
contents.on("will-navigate", (event, url) => {
 event.preventDefault();
 if (url === "https://example.com") {
  /* reviewed allowlist path */
 }
});
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-unrestricted-navigation": "error",
  },
 },
];
```

## When not to use it

Disable only if navigation and window-opening are governed by a reviewed allowlist abstraction outside the immediate handler.

## Package documentation

- [Rule source](../../src/rules/no-electron-unrestricted-navigation.ts)

## Further reading

> **Rule catalog ID:** R037

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
