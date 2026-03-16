# no-unsafe-cast-to-trusted-types

> **Rule catalog ID:** R045

## Targeted pattern scope

Type assertions/casts to Trusted Types without trusted factory creation.

## What this rule reports

Unsafe casts/as-assertions to `TrustedHTML`/`TrustedScript`/`TrustedScriptURL`.

## Why this rule exists

Type-only casts do not sanitize data and can bypass Trusted Types enforcement intent.

## ❌ Incorrect

```ts
const trusted = userHtml as TrustedHTML;
```

## ✅ Correct

```ts
const trusted = policy.createHTML(userHtml) as TrustedHTML;
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
