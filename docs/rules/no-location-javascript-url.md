# no-location-javascript-url

Disallow `javascript:` URLs in location-like navigation sinks.

## Targeted pattern scope

Location/open navigation sinks assigned `javascript:` URLs.

## What this rule reports

Assignments and calls that pass `javascript:` URL strings into navigation sinks.

## Why this rule exists

`javascript:` URL execution is a classic DOM XSS sink and should be blocked in modern code.

## ❌ Incorrect

```ts
window.location.href = "javascript:alert(1)";
```

## ✅ Correct

```ts
window.location.href = "https://example.com";
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-location-javascript-url": "error",
  },
 },
];
```

## When not to use it

Disable only for legacy code that cannot yet migrate away from `javascript:` URLs and has explicit security review sign-off.

## Package documentation

- [Rule source](../../src/rules/no-location-javascript-url.ts)

## Further reading

> **Rule catalog ID:** R042

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
