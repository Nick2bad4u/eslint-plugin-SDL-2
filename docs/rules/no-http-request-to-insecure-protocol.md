# no-http-request-to-insecure-protocol

Disallow application HTTP client calls that use insecure `http://` endpoints.

## Targeted pattern scope

Network client calls to insecure `http://` endpoints.

## What this rule reports

`http`/`https`/`fetch` calls whose URL literal starts with `http://`.

## Why this rule exists

Unencrypted HTTP can expose credentials, tokens, and payload integrity to active network attackers.

## ❌ Incorrect

```ts
http.get("http://api.example.com/status");
```

## ✅ Correct

```ts
https.get("https://api.example.com/status");
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-http-request-to-insecure-protocol": "error",
  },
 },
];
```

## When not to use it

Disable only for local development or legacy endpoints that are explicitly non-production and otherwise protected.

## Package documentation

- [Rule source](../../src/rules/no-http-request-to-insecure-protocol.ts)

## Further reading

> **Rule catalog ID:** R040

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
