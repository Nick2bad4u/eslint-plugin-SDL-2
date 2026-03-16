# no-domparser-html-without-sanitization

Disallow `DOMParser.parseFromString(..., "text/html")` on unsanitized input.

## Targeted pattern scope

`DOMParser.parseFromString(..., "text/html")` on unsanitized input.

## What this rule reports

HTML parsing calls where the source value is not sanitized by an explicit policy function.

## Why this rule exists

Parsing unsanitized HTML creates unsafe document fragments and XSS surfaces.

## ❌ Incorrect

```ts
new DOMParser().parseFromString(userHtml, "text/html");
```

## ✅ Correct

```ts
new DOMParser().parseFromString(sanitize(userHtml), "text/html");
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-domparser-html-without-sanitization": "error",
  },
 },
];
```

## When not to use it

Disable only if the parsed HTML is produced by a reviewed sanitizer or a fully trusted template source.

## Package documentation

- [Rule source](../../src/rules/no-domparser-html-without-sanitization.ts)

## Further reading

> **Rule catalog ID:** R033

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
