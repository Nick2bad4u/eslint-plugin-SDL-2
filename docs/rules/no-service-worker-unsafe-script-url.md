---
title: no-service-worker-unsafe-script-url
---

# no-service-worker-unsafe-script-url

Disallow unsafe service worker script URLs such as `data:`, `blob:`, `javascript:`, and direct `URL.createObjectURL(...)` registrations.

## Targeted pattern scope

This rule targets `navigator.serviceWorker.register(...)` when the script URL is
one of the following direct expressions:

- a static `data:` URL
- a static `blob:` URL
- a static `javascript:` URL
- a direct `URL.createObjectURL(...)` call

The rule also covers `window.navigator`, `self.navigator`, and
`globalThis.navigator` access forms.

## What this rule reports

This rule reports direct unsafe service worker registration URLs only. Indirect
variables and broader registration policies are out of scope.

## Why this rule exists

`ServiceWorkerContainer.register()` is an executable script-loading sink. Using
non-reviewable or dynamically generated script URLs for service workers makes
registration paths harder to audit and can undermine SDL expectations around
trusted worker code.

## ❌ Incorrect

```ts
navigator.serviceWorker.register("data:text/javascript,bootstrap()");
```

```ts
globalThis.navigator.serviceWorker.register(URL.createObjectURL(workerBlob));
```

## ✅ Correct

```ts
navigator.serviceWorker.register("/sw.js");
```

## Behavior and migration notes

This rule intentionally focuses on direct unsafe script URL expressions. Dynamic
variables, Trusted Types policies, and broader origin-validation strategies are
out of scope.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-service-worker-unsafe-script-url": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your project intentionally relies on these service
worker registration forms and that design has been reviewed and approved.

## Package documentation

- [Rule source](../../src/rules/no-service-worker-unsafe-script-url.ts)

## Further reading

> **Rule catalog ID:** R069

- [MDN: `ServiceWorkerContainer.register()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)
- [Trusted Types: injection sinks](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
