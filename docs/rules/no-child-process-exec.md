---
title: no-child-process-exec
---

# no-child-process-exec

Disallow `child_process.exec()` and `child_process.execSync()` shell-backed execution APIs.

## Targeted pattern scope

This rule targets `exec()` and `execSync()` when they are imported from
`child_process` or `node:child_process`, destructured from `require(...)`, or
called through a namespace binding created from those modules.

## What this rule reports

This rule reports direct use of `child_process.exec()` and
`child_process.execSync()` because both APIs execute a command string through a
shell.

## Why this rule exists

Shell-backed command execution is harder to review safely than argv-separated
process launches. When user-controlled data is concatenated into a command
string, it can become command injection.

For SDL-oriented code review, `spawn()` and `execFile()` are generally easier
to reason about because they keep the executable path and the arguments
separate.

## ❌ Incorrect

```ts
import { exec } from "node:child_process";

exec(`git show ${userSuppliedRef}`);
```

```ts
const { execSync } = require("child_process");

execSync("tar -xf " + archivePath);
```

```ts
import * as childProcess from "node:child_process";

childProcess.exec("convert " + inputPath);
```

## ✅ Correct

```ts
import { execFile } from "node:child_process";

execFile("git", ["show", userSuppliedRef]);
```

```ts
const { spawn } = require("child_process");

spawn("tar", ["-xf", archivePath], { shell: false });
```

## Behavior and migration notes

This rule intentionally focuses on direct `child_process` bindings and does not
attempt to reason about custom wrapper utilities that may call `exec()`
internally.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-child-process-exec": "error",
  },
 },
];
```

## When not to use it

If your project intentionally permits shell-backed command execution and you
already review all command construction paths carefully, this rule may be too
strict.

## Package documentation

- [Rule source](../../src/rules/no-child-process-exec.ts)

## Further reading

> **Rule catalog ID:** R062

- [Node.js child\_process documentation](https://nodejs.org/api/child_process.html)
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
