# no-child-process-shell-true

Disallow Node child process options that enable `shell: true`.

## Targeted pattern scope

Node child\_process execution options that enable `shell: true`.

## What this rule reports

`spawn(...)` / `execFile(...)` options objects with `shell: true`.

## Why this rule exists

Shell execution expands injection risk when command fragments include user-influenced input.

## ❌ Incorrect

```ts
spawn("cmd", ["/c", command], { shell: true });
```

## ✅ Correct

```ts
spawn("node", ["script.js"], { shell: false });
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-child-process-shell-true": "error",
  },
 },
];
```

## When not to use it

Disable only when shell execution is unavoidable and all command fragments are strictly controlled and validated.

## Package documentation

- [Rule source](../../src/rules/no-child-process-shell-true.ts)

## Further reading

> **Rule catalog ID:** R032

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
