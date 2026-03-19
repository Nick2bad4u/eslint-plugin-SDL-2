# no-document-execcommand-insert-html

Disallow `document.execCommand("insertHTML", ...)` HTML insertion sinks.

## Targeted pattern scope

This rule targets `Document.execCommand(...)` calls when the command name is the
static string `insertHTML` and the inserted value is non-empty.

## What this rule reports

This rule reports `document.execCommand("insertHTML", false, html)` style calls
because that command inserts markup into the current selection or editing host.

## Why this rule exists

`execCommand("insertHTML", ...)` is an HTML sink. When the inserted markup comes
from untrusted or weakly reviewed input, it can create XSS exposure in rich-text
editors and other editable surfaces.

## ❌ Incorrect

```ts
document.execCommand("insertHTML", false, userHtml);
```

## ✅ Correct

```ts
document.execCommand("insertText", false, userText);
```

## Behavior and migration notes

This rule intentionally focuses only on the `insertHTML` command and ignores
other `execCommand(...)` usages such as `copy` or `bold`. Empty string
insertions are also ignored to keep the rule narrow and low-noise.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-document-execcommand-insert-html": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your editor pipeline has a reviewed requirement to
insert trusted HTML through `execCommand("insertHTML", ...)` and that trust
boundary is documented.

## Package documentation

- [Rule source](../../src/rules/no-document-execcommand-insert-html.ts)

## Further reading

> **Rule catalog ID:** R060

- [MDN: `Document.execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
- [OWASP Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
