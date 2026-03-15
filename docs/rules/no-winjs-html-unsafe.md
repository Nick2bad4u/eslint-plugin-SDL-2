# no-winjs-html-unsafe

Disallow unsafe WinJS HTML helpers that bypass validation.

## Targeted pattern scope

This rule targets WinJS unsafe sink helpers such as:

- `WinJS.Utilities.setInnerHTMLUnsafe(...)`
- `WinJS.Utilities.setOuterHTMLUnsafe(...)`
- `WinJS.Utilities.insertAdjacentHTMLUnsafe(...)`.

## What this rule reports

This rule reports direct use of WinJS unsafe HTML insertion helpers.

## Why this rule exists

Unsafe HTML helper APIs increase XSS risk when supplied with untrusted content.

## ❌ Incorrect

```ts
WinJS.Utilities.setInnerHTMLUnsafe(element, userSuppliedHtml);
```

## ✅ Correct

```ts
WinJS.Utilities.setInnerHTML(element, trustedTemplateHtml);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-winjs-html-unsafe": "error",
    },
  },
];
```

## When not to use it

Disable only for fully controlled HTML templates with an audited trust chain.

## Package documentation

- [Rule source](../../src/rules/no-winjs-html-unsafe.ts)

## Further reading

> **Rule catalog ID:** R217

- [WinJS utilities API overview](https://learn.microsoft.com/en-us/previous-versions/windows/apps/br229839\(v=win.10\))
