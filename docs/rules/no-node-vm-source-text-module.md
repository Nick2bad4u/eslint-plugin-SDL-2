---
title: no-node-vm-source-text-module
---

# no-node-vm-source-text-module

Disallow `node:vm` `SourceTextModule` constructors that compile JavaScript source strings into executable modules.

## Targeted pattern scope

This rule targets `SourceTextModule` constructors imported from `node:vm` or
`vm`.

The rule covers:

- named imports like `import { SourceTextModule } from "node:vm"`
- namespace/default bindings like `vm.SourceTextModule`
- CommonJS `require(...)` destructuring and namespace access

## What this rule reports

This rule reports `new SourceTextModule(...)` for the Node `vm` module.

## Why this rule exists

`SourceTextModule` compiles JavaScript module source from a string. Like other
`node:vm` code-loading APIs, it is easy to mistake this for a security boundary
when it is really an executable code sink that deserves explicit SDL review.

## ❌ Incorrect

```ts
import { SourceTextModule } from "node:vm";

new SourceTextModule(userSuppliedModuleCode);
```

## ✅ Correct

```ts
await import(new URL("./module.js", import.meta.url).href);
```

## Behavior and migration notes

This rule intentionally focuses on `SourceTextModule` construction through the
Node `vm` module. It does not attempt to determine whether a specific source
string is trusted.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-node-vm-source-text-module": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your project intentionally relies on `SourceTextModule`
and that design has been reviewed and approved.

## Package documentation

- [Rule source](../../src/rules/no-node-vm-source-text-module.ts)

## Further reading

> **Rule catalog ID:** R071

- [Node.js: `vm.SourceTextModule`](https://nodejs.org/api/vm.html)
- [CWE-94: Improper Control of Generation of Code](https://cwe.mitre.org/data/definitions/94.html)
