# no-angular-innerhtml-binding

Disallow Angular `[innerHTML]` bindings for raw HTML without a reviewed sanitization strategy.

## Targeted pattern scope

Angular template bindings that write raw HTML using `[innerHTML]`.

## What this rule reports

Template fragments containing `[innerHTML]=...` bindings.

## Why this rule exists

Raw HTML bindings are high-risk unless source content is tightly sanitized and policy-reviewed.

## ❌ Incorrect

```ts
const template = `<div [innerHTML]="userHtml"></div>`;
```

## ✅ Correct

```ts
const template = `<div>{{ safeText }}</div>`;
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-angular-innerhtml-binding": "error",
  },
 },
];
```

## When not to use it

Disable only when your application has a documented, reviewed sanitization policy for the HTML source being bound.

## Package documentation

- [Rule source](../../src/rules/no-angular-innerhtml-binding.ts)

## Further reading

> **Rule catalog ID:** R029

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
