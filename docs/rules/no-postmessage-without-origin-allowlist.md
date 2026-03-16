# no-postmessage-without-origin-allowlist

Require explicit allowlisted origins for `postMessage` targetOrigin values.

## Targeted pattern scope

`postMessage` calls without strict explicit target-origin allowlists.

## What this rule reports

`postMessage` targetOrigin values that are wildcard or non-literal/dynamic.

## Why this rule exists

Weak targetOrigin control can expose cross-origin data or command channels to malicious frames.

## ❌ Incorrect

```ts
target.postMessage(data, "*");
```

## ✅ Correct

```ts
target.postMessage(data, "https://example.com");
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-postmessage-without-origin-allowlist": "error",
  },
 },
];
```

## When not to use it

Disable only if the target origin is validated by a reviewed helper abstraction or a controlled embedding environment.

## Package documentation

- [Rule source](../../src/rules/no-postmessage-without-origin-allowlist.ts)

## Further reading

> **Rule catalog ID:** R044

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
