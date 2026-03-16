# no-unsafe-cast-to-trusted-types

Disallow unsafe casts to Trusted Types without using trusted factory creation.

## Targeted pattern scope

Type assertions/casts to Trusted Types without trusted factory creation.

## What this rule reports

Unsafe casts/as-assertions to `TrustedHTML`/`TrustedScript`/`TrustedScriptURL`.

## Why this rule exists

Type-only casts do not sanitize data and can bypass Trusted Types enforcement intent.

## ❌ Incorrect

```ts
const trusted = userHtml as TrustedHTML;
```

## ✅ Correct

```ts
const trusted = policy.createHTML(userHtml) as TrustedHTML;
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-unsafe-cast-to-trusted-types": "error",
  },
 },
];
```

## When not to use it

Disable only if Trusted Type objects are guaranteed by a reviewed factory or policy wrapper that this rule cannot observe.

## Package documentation

- [Rule source](../../src/rules/no-unsafe-cast-to-trusted-types.ts)

## Further reading

> **Rule catalog ID:** R045

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
