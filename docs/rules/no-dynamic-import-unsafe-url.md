---
title: no-dynamic-import-unsafe-url
---

# no-dynamic-import-unsafe-url

Disallow dynamic `import()` calls that load code from `data:`, `blob:`, `javascript:`, and direct `URL.createObjectURL(...)` URLs.

## Targeted pattern scope

This rule targets direct `import(...)` expressions when the module specifier is
one of the following executable URL forms:

- a static `data:` URL
- a static `blob:` URL
- a static `javascript:` URL
- a direct `URL.createObjectURL(...)` call

## What this rule reports

This rule reports only direct unsafe dynamic-import specifiers. Indirect
variables and broader module-resolution policies are out of scope.

## Why this rule exists

Dynamic `import()` is an executable module-loading sink. Loading modules from
inline, generated, or review-hostile URLs makes trusted code boundaries harder
to audit and can undermine SDL expectations around reviewed module sources.

## ❌ Incorrect

```ts
await import("data:text/javascript,export default run()");
```

```ts
await import(URL.createObjectURL(workerBlob));
```

## ✅ Correct

```ts
await import("./feature-module.js");
```

## Behavior and migration notes

This rule intentionally focuses on direct unsafe script URL expressions in
`import(...)`. Indirect variables, import maps, and broader policy enforcement
are out of scope.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-dynamic-import-unsafe-url": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your project intentionally relies on these dynamic
module-loading patterns and that design has been reviewed and approved.

## Package documentation

- [Rule source](../../src/rules/no-dynamic-import-unsafe-url.ts)

## Further reading

> **Rule catalog ID:** R070

- [MDN: `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
- [Trusted Types: injection sinks](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
