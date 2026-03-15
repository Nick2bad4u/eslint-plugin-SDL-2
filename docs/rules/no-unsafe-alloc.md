# no-unsafe-alloc

Disallow unsafe uninitialized buffer allocation APIs in Node.js.

## Targeted pattern scope

This rule targets:

- `Buffer.allocUnsafe(...)`
- `Buffer.allocUnsafeSlow(...)`.

## What this rule reports

This rule reports calls to unsafe buffer constructors that may expose stale
memory data.

## Why this rule exists

Unsafe buffer allocation can leak sensitive process memory contents if buffers
are consumed before full initialization.

## ❌ Incorrect

```ts
const payload = Buffer.allocUnsafe(64);
```

## ✅ Correct

```ts
const payload = Buffer.alloc(64);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-unsafe-alloc": "error",
    },
  },
];
```

## When not to use it

Disable only for profiled performance hotspots that guarantee complete buffer
initialization before use.

## Package documentation

- [Rule source](../../src/rules/no-unsafe-alloc.ts)

## Further reading

> **Rule catalog ID:** R216

- [Node.js buffer security note](https://nodejs.org/api/buffer.html#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-unsafe)
