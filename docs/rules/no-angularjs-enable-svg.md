# no-angularjs-enable-svg

Disallow enabling AngularJS sanitizer SVG support without strict review.

## Targeted pattern scope

This rule targets `$sanitizeProvider.enableSvg(true)` calls.

## What this rule reports

This rule reports code that enables SVG support in AngularJS sanitization
configuration.

## Why this rule exists

SVG content can introduce scriptable surfaces and raise injection risk when
enabled in sanitizers.

## ❌ Incorrect

```ts
$sanitizeProvider.enableSvg(true);
```

## ✅ Correct

```ts
$sanitizeProvider.enableSvg(false);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-angularjs-enable-svg": "error",
    },
  },
];
```

## When not to use it

Disable only when SVG rendering is mandatory and guarded by a reviewed
sanitization strategy.

## Package documentation

- [Rule source](../../src/rules/no-angularjs-enable-svg.ts)

## Further reading

> **Rule catalog ID:** R004

- [AngularJS `$sanitizeProvider.enableSvg` docs](https://docs.angularjs.org/api/ngSanitize/provider/%24sanitizeProvider#enableSvg)
