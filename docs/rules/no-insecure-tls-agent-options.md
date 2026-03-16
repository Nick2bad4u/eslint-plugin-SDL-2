# no-insecure-tls-agent-options

Disallow TLS and HTTPS option objects that disable certificate verification.

## Targeted pattern scope

TLS/HTTPS options objects that disable certificate verification.

## What this rule reports

`rejectUnauthorized: false` in option objects.

## Why this rule exists

Disabling certificate verification removes core TLS trust guarantees.

## ❌ Incorrect

```ts
new https.Agent({ rejectUnauthorized: false });
```

## ✅ Correct

```ts
new https.Agent({ rejectUnauthorized: true });
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-insecure-tls-agent-options": "error",
  },
 },
];
```

## When not to use it

Disable only in tightly scoped debugging or local interception scenarios that cannot affect production traffic.

## Package documentation

- [Rule source](../../src/rules/no-insecure-tls-agent-options.ts)

## Further reading

> **Rule catalog ID:** R041

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
