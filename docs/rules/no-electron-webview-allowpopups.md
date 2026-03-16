# no-electron-webview-allowpopups

Disallow enabling `allowpopups` on Electron `<webview>` elements.

## Targeted pattern scope

Electron `<webview>` usage with `allowpopups` enabled.

## What this rule reports

JSX `<webview>` attributes that enable `allowpopups`.

## Why this rule exists

Allowing popups from embedded untrusted content expands attack surface and abuse channels.

## ❌ Incorrect

```ts
const view = <webview allowpopups src="https://example.com" />;
```

## ✅ Correct

```ts
const view = <webview src="https://example.com" />;
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-webview-allowpopups": "error",
  },
 },
];
```

## When not to use it

Disable only if the embedded content is fully trusted and popup behavior is part of a reviewed application design.

## Package documentation

- [Rule source](../../src/rules/no-electron-webview-allowpopups.ts)

## Further reading

> **Rule catalog ID:** R038

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
