# no-postmessage-without-origin-allowlist

> **Rule catalog ID:** R044

## Targeted pattern scope

`postMessage` calls without strict explicit target-origin allowlists.

## What this rule reports

`postMessage` targetOrigin values that are wildcard or non-literal/dynamic.

## Why this rule exists

Weak targetOrigin control can expose cross-origin data or command channels to malicious frames.

## ❌ Incorrect

```ts
target.postMessage(data, "*");
```

## ✅ Correct

```ts
target.postMessage(data, "https://example.com");
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
