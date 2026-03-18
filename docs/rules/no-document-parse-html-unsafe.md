# no-document-parse-html-unsafe

Disallow `Document.parseHTMLUnsafe()` calls that parse HTML through the unsafe document-construction path.

## Targeted pattern scope

This rule targets direct `Document.parseHTMLUnsafe(...)` calls, including
`window.Document.parseHTMLUnsafe(...)` and `globalThis.Document.parseHTMLUnsafe(...)`.

## What this rule reports

This rule reports `Document.parseHTMLUnsafe(...)` because that API name is the
explicit unsafe parsing path for creating a new `Document` from HTML.

## Why this rule exists

`Document.parseHTMLUnsafe()` does not guarantee that XSS-unsafe markup will be
removed. That makes it a poor default for application code that handles HTML
input, especially when a safer `Document.parseHTML()` path or a reviewed
sanitization pipeline is available.

## ❌ Incorrect

```ts
const parsed = Document.parseHTMLUnsafe(userHtml);
```

## ✅ Correct

```ts
const parsed = Document.parseHTML(userHtml);
```

## Behavior and migration notes

This rule intentionally reports the unsafe API itself instead of trying to infer
whether an optional sanitizer argument is strong enough. If you truly need the
unsafe API for a reviewed edge case, disable the rule locally and document that
trust boundary.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-document-parse-html-unsafe": "error",
  },
 },
];
```

## When not to use it

Disable only if your codebase has a reviewed requirement to use
`Document.parseHTMLUnsafe()` and that call site is already protected by a
sanitization policy this rule cannot verify.

## Package documentation

- [Rule source](../../src/rules/no-document-parse-html-unsafe.ts)

## Further reading

> **Rule catalog ID:** R056

- [MDN: `Document.parseHTMLUnsafe()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/parseHTMLUnsafe_static)
- [MDN: `Document.parseHTML()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/parseHTML_static)
- [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
