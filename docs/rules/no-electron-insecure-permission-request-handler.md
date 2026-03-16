# no-electron-insecure-permission-request-handler

> **Rule catalog ID:** R035

## Targeted pattern scope

Electron permission handlers that blanket-allow permission requests.

## What this rule reports

`setPermissionRequestHandler` callbacks that unconditionally `callback(true)` or return `true`.

## Why this rule exists

Blindly granting permissions can expose camera, microphone, clipboard, and notification abuse vectors.

## ❌ Incorrect

```ts
session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => { callback(true); });
```

## ✅ Correct

```ts
session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => { callback(permission === "notifications"); });
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
