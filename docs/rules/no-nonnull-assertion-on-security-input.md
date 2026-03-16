# no-nonnull-assertion-on-security-input

Disallow TypeScript non-null assertions on likely security-sensitive input values.

## Targeted pattern scope

TypeScript non-null assertions on security-sensitive input values.

## What this rule reports

TS non-null assertions on identifiers/properties with security-sensitive names.

## Why this rule exists

Non-null assertions can hide validation gaps and bypass defensive checks on attacker-controlled input.

## ❌ Incorrect

```ts
const safe = userInput!;
```

## ✅ Correct

```ts
const safe = validateInput(userInput);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-nonnull-assertion-on-security-input": "error",
  },
 },
];
```

## When not to use it

Disable only if the value has already been validated by a reviewed guard that this rule cannot statically recognize.

## Package documentation

- [Rule source](../../src/rules/no-nonnull-assertion-on-security-input.ts)

## Further reading

> **Rule catalog ID:** R043

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
