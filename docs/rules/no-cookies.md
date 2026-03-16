# no-cookies

Disallow client-side cookie usage patterns that increase session and data risk.

## Targeted pattern scope

This rule targets browser cookie read and write patterns, including direct
access to `document.cookie`.

## What this rule reports

This rule reports cookie usage in client code where safer or less exposed
storage patterns are preferred.

## Why this rule exists

Cookies are frequently sent over network requests and can expand leakage and
tampering risk when misconfigured.

## ❌ Incorrect

```ts
document.cookie = `sessionToken=${token}; path=/`;
```

## ✅ Correct

```ts
localStorage.setItem("sessionToken", token);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-cookies": "error",
    },
  },
];
```

## When not to use it

Disable this rule when application requirements mandate cookie-backed sessions
with hardened attributes and server controls.

## Package documentation

- [Rule source](../../src/rules/no-cookies.ts)

## Further reading

> **Rule catalog ID:** R006

- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Legacy rule inspiration](https://github.com/microsoft/tslint-microsoft-contrib/blob/master/src/noCookiesRule.ts)
