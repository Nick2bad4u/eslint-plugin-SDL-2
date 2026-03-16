# no-domparser-html-without-sanitization

> **Rule catalog ID:** R033

## Targeted pattern scope

`DOMParser.parseFromString(..., "text/html")` on unsanitized input.

## What this rule reports

HTML parsing calls where the source value is not sanitized by an explicit policy function.

## Why this rule exists

Parsing unsanitized HTML creates unsafe document fragments and XSS surfaces.

## ❌ Incorrect

```ts
new DOMParser().parseFromString(userHtml, "text/html");
```

## ✅ Correct

```ts
new DOMParser().parseFromString(sanitize(userHtml), "text/html");
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
