# no-angularjs-bypass-sce

Disallow AngularJS Strict Contextual Escaping (SCE) bypass operations.

## Targeted pattern scope

This rule targets APIs that disable or bypass SCE, including:

- `$sceProvider.enabled(false)`
- `$sceDelegate.trustAs(...)`
- `$sce.trustAs(...)` and shorthand variants such as `trustAsHtml(...)`.

## What this rule reports

This rule reports SCE bypass usage that marks values as trusted without
framework sanitization.

## Why this rule exists

SCE is a core AngularJS defense against unsafe DOM and script sinks. Bypassing
it expands XSS attack surface.

## ❌ Incorrect

```ts
$sceProvider.enabled(false);
const trusted = $sce.trustAsHtml(userSuppliedHtml);
```

## ✅ Correct

```ts
// Keep SCE enabled and render untrusted data through AngularJS bindings.
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-angularjs-bypass-sce": "error",
    },
  },
];
```

## When not to use it

Disable only in tightly controlled migration paths where bypass calls are
isolated and reviewed.

## Package documentation

- [Rule source](../../src/rules/no-angularjs-bypass-sce.ts)

## Further reading

> **Rule catalog ID:** R203

- [AngularJS `$sce` strict contextual escaping](https://docs.angularjs.org/api/ng/service/%24sce#strict-contextual-escaping)
