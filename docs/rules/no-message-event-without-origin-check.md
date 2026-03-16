# no-message-event-without-origin-check

Disallow receiving `message` events and consuming `event.data` without checking
`event.origin`.

## Targeted pattern scope

This rule targets inline `addEventListener("message", ...)` handlers and
`onmessage = ...` assignments that read message data without validating the
sender origin.

## What this rule reports

This rule reports message event callbacks that:

- read `event.data`, or
- destructure `{ data }` from the message event,

without an observable `origin` validation step.

## Why this rule exists

Cross-document messaging is only safe when the receiver validates where the
message came from. Reading message payloads without checking `event.origin` can
trust attacker-controlled input from another window, frame, or worker.

## ❌ Incorrect

```ts
window.addEventListener("message", (event) => {
 consume(event.data);
});
```

## ✅ Correct

```ts
window.addEventListener("message", (event) => {
 if (event.origin !== "https://example.com") {
  return;
 }

 consume(event.data);
});
```

## Behavior and migration notes

This rule intentionally does not autofix or insert stub origin checks because
the correct allowlist depends on your deployment model.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-message-event-without-origin-check": "error",
  },
 },
];
```

## When not to use it

Disable only for message handlers that never process untrusted cross-origin
messages and already rely on a reviewed trust boundary this rule cannot see.

## Package documentation

- [Rule source](../../src/rules/no-message-event-without-origin-check.ts)

## Further reading

> **Rule catalog ID:** R048

- [MDN: Window message event](https://developer.mozilla.org/docs/Web/API/Window/message_event)
- [MDN: Window.postMessage security concerns](https://developer.mozilla.org/docs/Web/API/Window/postMessage#security_concerns)
