# no-script-text

Disallow assigning executable code through `<script>` text sinks.

## Targeted pattern scope

This rule targets assignments to the following `HTMLScriptElement` properties:

- `script.text = ...`
- `script.textContent = ...`
- `script.innerText = ...`

The rule uses type information when available and otherwise falls back to narrow
syntax heuristics such as `document.createElement("script")` or identifiers like
`scriptElement`.

## What this rule reports

This rule reports non-empty assignments that inject code directly into script
text sinks.

## Why this rule exists

Writing source code directly into a `<script>` element turns data flow into code
execution. That creates an obvious XSS/code-injection sink and bypasses safer
patterns such as loading reviewed static modules or script URLs.

## ❌ Incorrect

```ts
const scriptElement = document.createElement("script");
scriptElement.textContent = userCode;
```

## ✅ Correct

```ts
const scriptElement = document.createElement("script");
scriptElement.src = "/assets/app.js";
```

## Behavior and migration notes

This rule allows empty-string resets such as `script.text = ""`.

It intentionally does not autofix because there is no universally safe rewrite
for executable inline script injection.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-script-text": "error",
  },
 },
];
```

## When not to use it

Disable only if your application intentionally emits inline script bodies,
those script bodies are tightly controlled, and the surrounding trust boundary
is reviewed outside this rule.

## Package documentation

- [Rule source](../../src/rules/no-script-text.ts)

## Further reading

> **Rule catalog ID:** R057

- [MDN: `HTMLScriptElement.textContent`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/textContent)
- [MDN: `HTMLScriptElement.text`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/text)
- [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
