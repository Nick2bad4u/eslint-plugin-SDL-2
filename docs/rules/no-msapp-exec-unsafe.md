# no-msapp-exec-unsafe

Disallow `MSApp.execUnsafeLocalFunction` calls that bypass script safety checks.

## Targeted pattern scope

This rule targets `MSApp.execUnsafeLocalFunction(...)` usage.

## What this rule reports

This rule reports direct calls to unsafe local function execution wrappers.

## Why this rule exists

This API bypasses platform script injection protections and can allow unsafe DOM
or script execution.

## ❌ Incorrect

```ts
MSApp.execUnsafeLocalFunction(() => {
  element.innerHTML = userSuppliedHtml;
});
```

## ✅ Correct

```ts
element.textContent = userSuppliedHtml;
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-msapp-exec-unsafe": "error",
    },
  },
];
```

## When not to use it

Disable only for legacy Windows Store app code that is isolated and audited.

## Package documentation

- [Rule source](../../src/rules/no-msapp-exec-unsafe.ts)

## Further reading

> **Rule catalog ID:** R214

- [Microsoft documentation: `MSApp.execUnsafeLocalFunction`](https://learn.microsoft.com/en-us/previous-versions/windows/apps/hh780593\(v=win.10\))
