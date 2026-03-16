# no-electron-insecure-certificate-verify-proc

Disallow Electron certificate verification callbacks that trust invalid certificates.

## Targeted pattern scope

Electron `session.setCertificateVerifyProc` handlers that trust invalid certificates.

## What this rule reports

Verify-proc handlers that `callback(0)` or return `0`.

## Why this rule exists

Overriding certificate checks can silently disable TLS trust guarantees.

## ❌ Incorrect

```ts
session.defaultSession.setCertificateVerifyProc((request, callback) => {
 callback(0);
});
```

## ✅ Correct

```ts
session.defaultSession.setCertificateVerifyProc((request, callback) => {
 callback(-3);
});
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-insecure-certificate-verify-proc": "error",
  },
 },
];
```

## When not to use it

Disable only if certificate trust is enforced through a reviewed pinning or enterprise policy outside the callback return value.

## Package documentation

- [Rule source](../../src/rules/no-electron-insecure-certificate-verify-proc.ts)

## Further reading

> **Rule catalog ID:** R034

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
