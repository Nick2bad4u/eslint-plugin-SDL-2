# no-inner-html

Disallow unsafe direct HTML writes through DOM HTML sink properties and methods.

## Targeted pattern scope

This rule targets:

- `element.innerHTML = ...`
- `element.outerHTML = ...`
- `element.insertAdjacentHTML(...)`.

## What this rule reports

This rule reports direct HTML sink writes that bypass safe text-based DOM APIs.

## Why this rule exists

HTML sink APIs are common XSS entry points when they receive unsanitized or
partially sanitized input.

## ❌ Incorrect

```ts
container.innerHTML = userSuppliedHtml;
container.insertAdjacentHTML("beforeend", userSuppliedHtml);
```

## ✅ Correct

```ts
const node = document.createElement("p");
node.textContent = userSuppliedHtml;
container.append(node);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-inner-html": "error",
  },
 },
];
```

## When not to use it

Disable only when a dedicated, reviewed sanitizer guarantees safe markup.

## Package documentation

- [Rule source](../../src/rules/no-inner-html.ts)

## Further reading

> **Rule catalog ID:** R019

- [MDN: `innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN: `insertAdjacentHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
