# no-electron-insecure-certificate-verify-proc

> **Rule catalog ID:** R034

## Targeted pattern scope

Electron `session.setCertificateVerifyProc` handlers that trust invalid certificates.

## What this rule reports

Verify-proc handlers that `callback(0)` or return `0`.

## Why this rule exists

Overriding certificate checks can silently disable TLS trust guarantees.

## ❌ Incorrect

```ts
session.defaultSession.setCertificateVerifyProc((request, callback) => { callback(0); });
```

## ✅ Correct

```ts
session.defaultSession.setCertificateVerifyProc((request, callback) => { callback(-3); });
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
