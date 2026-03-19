---
title: no-node-vm-run-in-context
---

# no-node-vm-run-in-context

Disallow `node:vm` dynamic code execution APIs that are commonly mistaken for a security sandbox.

## Targeted pattern scope

This rule targets `node:vm` and `vm` imports or `require(...)` bindings when
code is executed through:

- `runInNewContext(...)`
- `runInContext(...)`
- `runInThisContext(...)`
- `compileFunction(...)`
- `new Script(...)`

## What this rule reports

This rule reports direct use of the `vm` module's code-execution APIs because
those APIs compile or execute JavaScript source text.

## Why this rule exists

Node's own documentation warns that the `vm` module is not a security
mechanism. Teams sometimes treat it like a safe sandbox for untrusted code, but
that assumption is fragile and can lead to code execution or sandbox-escape
exposure.

## ❌ Incorrect

```ts
import vm from "node:vm";

vm.runInNewContext(userCode, sandbox);
```

```ts
const { Script } = require("vm");

new Script(untrustedSource);
```

## ✅ Correct

```ts
import vm from "node:vm";

vm.measureMemory();
```

## Behavior and migration notes

This rule intentionally focuses on the `vm` module's code-execution entry
points. It does not attempt to determine whether a specific source string is
trusted.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-node-vm-run-in-context": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your project has a reviewed and documented reason to
use `node:vm` code-execution APIs and that risk is accepted explicitly.

## Package documentation

- [Rule source](../../src/rules/no-node-vm-run-in-context.ts)

## Further reading

> **Rule catalog ID:** R064

- [Node.js documentation: `node:vm`](https://nodejs.org/api/vm.html)
- [Node.js documentation note: The `node:vm` module is not a security mechanism](https://nodejs.org/api/vm.html)
