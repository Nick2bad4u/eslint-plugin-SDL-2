---
title: no-node-worker-threads-eval
---

# no-node-worker-threads-eval

Disallow `node:worker_threads` `Worker` options that enable `eval: true` string execution.

## Targeted pattern scope

This rule targets `Worker` constructors imported from `node:worker_threads` or
`worker_threads` when the options object contains `eval: true`.

The rule covers:

- named imports like `import { Worker } from "node:worker_threads"`
- namespace/default bindings like `workerThreads.Worker`
- CommonJS `require(...)` destructuring and namespace access

## What this rule reports

This rule reports `new Worker(..., { eval: true })` for Node worker threads.

## Why this rule exists

`eval: true` changes the first `Worker` argument from a reviewed script path to
an executable code string. That makes worker startup behave more like `eval()`
or `new Function(...)`, which is harder to review safely and can blur trust
boundaries around code execution.

## ❌ Incorrect

```ts
import { Worker } from "node:worker_threads";

new Worker(userSuppliedCode, { eval: true });
```

## ✅ Correct

```ts
import { Worker } from "node:worker_threads";

new Worker(new URL("./worker.js", import.meta.url));
```

## Behavior and migration notes

This rule intentionally focuses on inline options objects with `eval: true` for
worker-thread constructors imported from the Node worker threads module.
Indirect options variables are out of scope.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-node-worker-threads-eval": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your project intentionally relies on string-backed
worker-thread execution and that design has been reviewed and approved.

## Package documentation

- [Rule source](../../src/rules/no-node-worker-threads-eval.ts)

## Further reading

> **Rule catalog ID:** R068

- [Node.js: `worker_threads` `Worker` constructor](https://nodejs.org/api/worker_threads.html)
- [CWE-94: Improper Control of Generation of Code](https://cwe.mitre.org/data/definitions/94.html)
