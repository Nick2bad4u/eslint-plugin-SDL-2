# no-range-create-contextual-fragment

Disallow `Range.createContextualFragment(...)` on unsanitized HTML input.

## Targeted pattern scope

This rule targets `range.createContextualFragment(html)` calls when the HTML
argument is not sanitized first.

## What this rule reports

This rule reports `Range.createContextualFragment(...)` calls whose first
argument is raw HTML instead of the output of a reviewed sanitizer or Trusted
Types-producing helper.

## Why this rule exists

`Range.createContextualFragment(...)` parses HTML strings into live DOM
fragments. Passing unsanitized markup into that parser recreates the same XSS
and DOM injection problems that appear with other HTML sink APIs.

## ❌ Incorrect

```ts
range.createContextualFragment(userHtml);
```

## ✅ Correct

```ts
range.createContextualFragment(sanitize(userHtml));
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-range-create-contextual-fragment": "error",
  },
 },
];
```

## When not to use it

Disable only if your HTML input has already passed through a reviewed sanitizer
or Trusted Types pipeline that this rule cannot recognize.

## Package documentation

- [Rule source](../../src/rules/no-range-create-contextual-fragment.ts)

## Further reading

> **Rule catalog ID:** R054

- [MDN: `Range.createContextualFragment()`](https://developer.mozilla.org/en-US/docs/Web/API/Range/createContextualFragment)
- [Trusted Types](https://web.dev/trusted-types/)
- [OWASP Cross Site Scripting Prevention Cheat Sheet](https://owasp.org/www-community/xss-prevention)
