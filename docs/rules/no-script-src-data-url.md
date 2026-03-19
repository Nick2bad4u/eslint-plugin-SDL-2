---
title: no-script-src-data-url
---

# no-script-src-data-url

Disallow `HTMLScriptElement.src` values that use `data:` URLs.

## Targeted pattern scope

This rule targets static `data:` URLs assigned to script `src` sinks such as
`script.src = ...`, `script.setAttribute("src", ...)`, and JSX
`<script src=...>`.

## What this rule reports

This rule reports `data:` URLs only when they are written into script-loading
sinks. It does not report non-script uses such as `img.src = "data:..."`.

## Why this rule exists

A `data:` URL in a script-loading sink embeds executable code directly in the
URL itself. That bypasses the usual reviewed external-script loading path and
makes it easier to smuggle code through values that look like plain strings.

## ❌ Incorrect

```ts
const script = document.createElement("script");
script.src = "data:text/javascript,alert('owned')";
```

```tsx
const loader = <script src="data:text/javascript,bootstrap()" />;
```

## ✅ Correct

```ts
const script = document.createElement("script");
script.src = "https://cdn.example.com/app.js";
```

```ts
const image = new Image();
image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA";
```

## Behavior and migration notes

This rule intentionally focuses on script `src` sinks and does not attempt to
analyze other executable loading surfaces such as workers.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-script-src-data-url": "error",
  },
 },
];
```

## When not to use it

If your codebase intentionally relies on `data:` script URLs and that behavior
is acceptable in your threat model, this rule may be too strict.

## Package documentation

- [Rule source](../../src/rules/no-script-src-data-url.ts)

## Further reading

> **Rule catalog ID:** R063

- [MDN: `HTMLScriptElement.src`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/src)
- [MDN: `data:` URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data)
