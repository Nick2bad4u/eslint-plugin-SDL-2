# no-postmessage-star-origin

Disallow wildcard target origins in `postMessage` calls.

## Targeted pattern scope

This rule targets `window.postMessage(...)` style calls where the target origin
argument is `"*"`.

## What this rule reports

This rule reports message sends that do not restrict target origin to a known
trusted origin.

## Why this rule exists

Using `"*"` can expose sensitive messages to unintended or attacker-controlled
origins.

## ❌ Incorrect

```ts
otherWindow.postMessage({ token }, "*");
```

## ✅ Correct

```ts
otherWindow.postMessage({ token }, "https://example.com");
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-postmessage-star-origin": "error",
  },
 },
];
```

## When not to use it

Disable only in controlled test harnesses where wildcard messaging is required.

## Package documentation

- [Rule source](../../src/rules/no-postmessage-star-origin.ts)

## Further reading

> **Rule catalog ID:** R024

- [MDN: `Window.postMessage` security concerns](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns)
