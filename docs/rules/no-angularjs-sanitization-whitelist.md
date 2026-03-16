# no-angularjs-sanitization-whitelist

Disallow AngularJS sanitization whitelist mutations that expand trusted inputs.

## Targeted pattern scope

This rule targets writes and calls that configure:

- `$compileProvider.aHrefSanitizationWhitelist(...)`
- `$compileProvider.imgSrcSanitizationWhitelist(...)`.

## What this rule reports

This rule reports allow-list mutations that broaden URL patterns accepted by
the AngularJS sanitizer.

## Why this rule exists

Overly broad sanitizer allow-lists can permit unsafe protocols or payloads and
increase XSS risk.

## ❌ Incorrect

```ts
$compileProvider.aHrefSanitizationWhitelist(/.*/);
$compileProvider.imgSrcSanitizationWhitelist(/.*/);
```

## ✅ Correct

```ts
// Keep default AngularJS sanitizer allow-lists.
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-angularjs-sanitization-whitelist": "error",
    },
  },
];
```

## When not to use it

Disable only when a migration requires temporary allow-list expansion that is
strictly bounded and reviewed.

## Package documentation

- [Rule source](../../src/rules/no-angularjs-sanitization-whitelist.ts)

## Further reading

> **Rule catalog ID:** R005

- [AngularJS `$compileProvider` API](https://docs.angularjs.org/api/ng/provider/%24compileProvider)
