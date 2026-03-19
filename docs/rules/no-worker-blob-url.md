---
title: no-worker-blob-url
---

# no-worker-blob-url

Disallow worker code-loading APIs that use `blob:` URLs or `URL.createObjectURL(...)` for executable scripts.

## Targeted pattern scope

This rule targets blob-backed worker code-loading through:

- `new Worker(...)`
- `new SharedWorker(...)`
- `importScripts(...)`

The rule reports both static `blob:` string URLs and direct
`URL.createObjectURL(...)` calls passed into those sinks.

## What this rule reports

This rule reports worker code-loading expressions that source executable code
from blob URLs or object URLs.

## Why this rule exists

Blob-backed worker bootstraps hide executable code behind dynamically generated
object URLs. That makes code-loading harder to audit and can blur trust
boundaries in worker startup paths.

## ❌ Incorrect

```ts
new Worker(URL.createObjectURL(workerBlob));
```

```ts
self.importScripts("blob:https://example.com/bootstrap");
```

## ✅ Correct

```ts
new Worker("https://cdn.example.com/worker.js");
```

```ts
self.importScripts("https://cdn.example.com/worker-helpers.js");
```

## Behavior and migration notes

This rule intentionally focuses on direct blob-backed worker code-loading
expressions. Indirect variables and broader blob URL usage are out of scope.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-worker-blob-url": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your project intentionally relies on blob-backed
worker code-loading and that design has been reviewed and approved.

## Package documentation

- [Rule source](../../src/rules/no-worker-blob-url.ts)

## Further reading

> **Rule catalog ID:** R067

- [MDN: `Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)
- [MDN: `URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN: `importScripts()`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts)
