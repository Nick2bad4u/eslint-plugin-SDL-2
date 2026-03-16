# no-html-method

Disallow unsafe HTML injection through jQuery-like `html()` method usage.

## Targeted pattern scope

This rule targets calls to `html(...)` methods on DOM wrapper libraries where
arguments are interpreted as HTML.

## What this rule reports

This rule reports `html(...)` invocations that write markup directly to the DOM.

## Why this rule exists

Direct HTML insertion can execute attacker-controlled markup and script payloads
when inputs are not strongly sanitized.

## ❌ Incorrect

```ts
$("#content").html(userSuppliedHtml);
```

## ✅ Correct

```ts
$("#content").text(userSuppliedHtml);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-html-method": "error",
    },
  },
];
```

## When not to use it

Disable only for trusted, static markup paths where inputs are guaranteed safe.

## Package documentation

- [Rule source](../../src/rules/no-html-method.ts)

## Further reading

> **Rule catalog ID:** R018

- [Legacy rule inspiration](https://github.com/microsoft/tslint-microsoft-contrib/blob/master/src/noInnerHtml.ts)
