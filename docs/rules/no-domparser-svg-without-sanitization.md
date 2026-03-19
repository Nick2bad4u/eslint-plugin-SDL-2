---
title: no-domparser-svg-without-sanitization
---

# no-domparser-svg-without-sanitization

Disallow `DOMParser.parseFromString(..., "image/svg+xml")` on unsanitized input.

## Targeted pattern scope

This rule targets `DOMParser.parseFromString(...)` when the MIME type is the
static string `"image/svg+xml"` and the source value is not passed through an
explicit sanitizer or trusted-policy helper.

## What this rule reports

This rule reports SVG parsing calls where the input is not sanitized first.

## Why this rule exists

SVG content can carry active content such as event handlers, script-adjacent
behavior, and external references. Parsing unsanitized SVG into a document can
create risky DOM fragments that are difficult to review safely.

## ❌ Incorrect

```ts
new DOMParser().parseFromString(userSvg, "image/svg+xml");
```

## ✅ Correct

```ts
new DOMParser().parseFromString(sanitize(userSvg), "image/svg+xml");
```

## Behavior and migration notes

This rule intentionally focuses on the explicit SVG parsing sink. It does not
attempt to prove whether a non-matching helper name is actually safe.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-domparser-svg-without-sanitization": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if the parsed SVG always comes from a reviewed sanitizer
or a fully trusted source and that guarantee is documented.

## Package documentation

- [Rule source](../../src/rules/no-domparser-svg-without-sanitization.ts)

## Further reading

> **Rule catalog ID:** R066

- [MDN: `DOMParser.parseFromString()`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString)
- [OWASP SVG Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SVG_Security_Cheat_Sheet.html)
