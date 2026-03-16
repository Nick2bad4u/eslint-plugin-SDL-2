# no-electron-webview-allowpopups

> **Rule catalog ID:** R038

## Targeted pattern scope

Electron `<webview>` usage with `allowpopups` enabled.

## What this rule reports

JSX `<webview>` attributes that enable `allowpopups`.

## Why this rule exists

Allowing popups from embedded untrusted content expands attack surface and abuse channels.

## ❌ Incorrect

```ts
const view = <webview allowpopups src="https://example.com" />;
```

## ✅ Correct

```ts
const view = <webview src="https://example.com" />;
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
