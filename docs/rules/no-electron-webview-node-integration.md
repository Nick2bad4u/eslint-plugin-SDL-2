# no-electron-webview-node-integration

> **Rule catalog ID:** R039

## Targeted pattern scope

Electron `<webview>` configurations enabling node integration flags.

## What this rule reports

`webview` `nodeintegration`/`nodeintegrationinsubframes`/`webpreferences` node-integration flags.

## Why this rule exists

Node integration in untrusted renderer contexts can break isolation and enable code-execution paths.

## ❌ Incorrect

```ts
const view = <webview nodeintegration src="https://example.com" />;
```

## ✅ Correct

```ts
const view = <webview src="https://example.com" webpreferences="sandbox=yes" />;
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
