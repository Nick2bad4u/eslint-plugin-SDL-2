# no-insecure-tls-agent-options

> **Rule catalog ID:** R041

## Targeted pattern scope

TLS/HTTPS options objects that disable certificate verification.

## What this rule reports

`rejectUnauthorized: false` in option objects.

## Why this rule exists

Disabling certificate verification removes core TLS trust guarantees.

## ❌ Incorrect

```ts
new https.Agent({ rejectUnauthorized: false });
```

## ✅ Correct

```ts
new https.Agent({ rejectUnauthorized: true });
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
