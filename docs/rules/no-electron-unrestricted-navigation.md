# no-electron-unrestricted-navigation

> **Rule catalog ID:** R037

## Targeted pattern scope

Electron navigation/open handlers that allow unrestricted navigation behavior.

## What this rule reports

`setWindowOpenHandler` returning allow, or `will-navigate` handlers that do not block by default.

## Why this rule exists

Unrestricted navigation can enable tabnabbing, phishing surfaces, and privilege-boundary bypasses.

## ❌ Incorrect

```ts
contents.setWindowOpenHandler(() => ({ action: "allow" }));
```

## ✅ Correct

```ts
contents.on("will-navigate", (event, url) => { event.preventDefault(); if (url === "https://example.com") { /* reviewed allowlist path */ } });
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
