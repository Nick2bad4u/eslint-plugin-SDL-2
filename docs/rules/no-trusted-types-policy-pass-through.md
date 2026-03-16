# no-trusted-types-policy-pass-through

Disallow Trusted Types policies that return unvalidated input unchanged.

## Targeted pattern scope

This rule targets `trustedTypes.createPolicy(...)` calls whose `createHTML`,
`createScript`, or `createScriptURL` callbacks simply return the first input
parameter unchanged.

## What this rule reports

This rule reports pass-through Trusted Types policy factories such as
`createHTML: (value) => value`.

## Why this rule exists

Trusted Types policies are supposed to narrow unsafe string flows. Pass-through
policies defeat that goal by rebranding untrusted input as trusted output
without any sanitization or validation.

## ❌ Incorrect

```ts
trustedTypes.createPolicy("default", {
 createHTML: (value) => value,
});
```

## ✅ Correct

```ts
trustedTypes.createPolicy("default", {
 createHTML: (value) => sanitize(value),
});
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-trusted-types-policy-pass-through": "error",
  },
 },
];
```

## When not to use it

Disable only if your Trusted Types policy wraps a reviewed validation layer that
this rule cannot observe and the pass-through shape is intentional.

## Package documentation

- [Rule source](../../src/rules/no-trusted-types-policy-pass-through.ts)

## Further reading

> **Rule catalog ID:** R052

- [Trusted Types](https://web.dev/trusted-types/)
- [MDN: Trusted Types API](https://developer.mozilla.org/docs/Web/API/Trusted_Types_API)
