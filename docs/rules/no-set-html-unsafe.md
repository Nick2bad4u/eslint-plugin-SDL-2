# no-set-html-unsafe

Disallow `setHTMLUnsafe()` calls that bypass the safer HTML Sanitizer API path.

## Targeted pattern scope

This rule targets direct `.setHTMLUnsafe(...)` calls.

## What this rule reports

This rule reports calls to `setHTMLUnsafe()` because that API is the explicit
unsafe escape hatch for injecting HTML content.

## Why this rule exists

`setHTMLUnsafe()` makes dangerous HTML parsing look deceptively close to the
safer `setHTML()` API. Standardizing on the safe API path reduces accidental use
of the unsafe variant and keeps security review focused on fewer HTML sink
surfaces.

## ❌ Incorrect

```ts
element.setHTMLUnsafe(userHtml);
```

## ✅ Correct

```ts
element.setHTML(userHtml);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-set-html-unsafe": "error",
  },
 },
];
```

## When not to use it

Disable only if you have an explicit requirement to use the unsafe HTML setter,
its inputs are tightly controlled, and the surrounding review process documents
why the safe `setHTML()` path is not sufficient.

## Package documentation

- [Rule source](../../src/rules/no-set-html-unsafe.ts)

## Further reading

> **Rule catalog ID:** R055

- [MDN: `Element.setHTMLUnsafe()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTMLUnsafe)
- [MDN: `Element.setHTML()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML)
- [HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
