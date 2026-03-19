---
title: no-worker-data-url
---

# no-worker-data-url

Disallow worker code-loading APIs that use static `data:` URLs for executable scripts.

## Targeted pattern scope

This rule targets static `data:` URLs passed to:

- `new Worker(...)`
- `new SharedWorker(...)`
- `importScripts(...)`

The rule also covers `window`, `self`, and `globalThis` member access forms.

## What this rule reports

This rule reports `data:` URLs only when they are used as worker code-loading
inputs. It does not report other non-worker `data:` URL usage.

## Why this rule exists

A `data:` URL in a worker entrypoint or `importScripts(...)` call embeds
executable JavaScript directly in the URL value. That makes code loading harder
to review and can blur trust boundaries in worker bootstrap paths.

## ❌ Incorrect

```ts
new Worker("data:text/javascript,postMessage('hi')");
```

```ts
self.importScripts("data:text/javascript,bootstrap()");
```

## ✅ Correct

```ts
new Worker("https://cdn.example.com/worker.js");
```

```ts
self.importScripts("https://cdn.example.com/worker-helpers.js");
```

## Behavior and migration notes

This rule intentionally focuses on static `data:` URLs in worker code-loading
APIs. Dynamic worker URLs and other worker-related risks are out of scope.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-worker-data-url": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your project intentionally relies on worker code from
`data:` URLs and that design has been reviewed and approved.

## Package documentation

- [Rule source](../../src/rules/no-worker-data-url.ts)

## Further reading

> **Rule catalog ID:** R065

- [MDN: `Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)
- [MDN: `importScripts()`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts)
- [MDN: `data:` URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data)
