# no-window-open-without-noopener

Require `noopener` when calling `window.open` with a `_blank` target.

## Targeted pattern scope

This rule targets `window.open(...)` calls where the second argument is the
literal target `_blank`.

## What this rule reports

This rule reports `_blank` `window.open(...)` calls when the third `features`
argument is missing or does not include `noopener`.

## Why this rule exists

Opening a new tab/window without `noopener` allows the opened page to access
`window.opener`, which can enable tabnabbing and opener-based navigation abuse.

## ❌ Incorrect

```ts
window.open("https://example.com", "_blank");
window.open("https://example.com", "_blank", "noreferrer");
```

## ✅ Correct

```ts
window.open("https://example.com", "_blank", "noopener");
window.open("https://example.com", "_blank", "noopener,noreferrer");
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-window-open-without-noopener": "error",
  },
 },
];
```

## When not to use it

Disable only if your codebase avoids `_blank` navigation entirely or enforces a
different audited opener-hardening abstraction.

## Package documentation

- [Rule source](../../src/rules/no-window-open-without-noopener.ts)

## Further reading

> **Rule catalog ID:** R026

- [MDN: Window.open()](https://developer.mozilla.org/docs/Web/API/Window/open)
- [OWASP: Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing)
