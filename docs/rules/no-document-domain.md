# no-document-domain

Disallow writes to `document.domain` that weaken same-origin boundaries.

## Targeted pattern scope

This rule targets assignments that modify `document.domain`.

## What this rule reports

This rule reports any direct write to `document.domain`.

## Why this rule exists

Changing `document.domain` can relax origin checks and create cross-origin trust
relationships that were not intended.

## ❌ Incorrect

```ts
document.domain = "example.com";
```

## ✅ Correct

```ts
// Keep default browser origin boundaries.
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-document-domain": "error",
  },
 },
];
```

## When not to use it

Disable only for vetted legacy integrations that cannot be migrated away from
`document.domain`.

## Package documentation

- [Rule source](../../src/rules/no-document-domain.ts)

## Further reading

> **Rule catalog ID:** R007

- [MDN: `document.domain`](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain)
- [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#changing_origin)
