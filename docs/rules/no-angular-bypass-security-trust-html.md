# no-angular-bypass-security-trust-html

> **Rule catalog ID:** R028

## Targeted pattern scope

Angular DomSanitizer bypass APIs for HTML trust.

## What this rule reports

Calls to `bypassSecurityTrustHtml(...)`.

## Why this rule exists

Bypassing Angular sanitization for HTML can introduce XSS if values are not strictly validated.

## ❌ Incorrect

```ts
const trusted = sanitizer.bypassSecurityTrustHtml(userHtml);
```

## ✅ Correct

```ts
const trusted = sanitizer.sanitize(SecurityContext.HTML, userHtml);
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
