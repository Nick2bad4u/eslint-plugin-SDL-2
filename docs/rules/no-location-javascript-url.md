# no-location-javascript-url

> **Rule catalog ID:** R042

## Targeted pattern scope

Location/open navigation sinks assigned `javascript:` URLs.

## What this rule reports

Assignments and calls that pass `javascript:` URL strings into navigation sinks.

## Why this rule exists

`javascript:` URL execution is a classic DOM XSS sink and should be blocked in modern code.

## ❌ Incorrect

```ts
window.location.href = "javascript:alert(1)";
```

## ✅ Correct

```ts
window.location.href = "https://example.com";
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
