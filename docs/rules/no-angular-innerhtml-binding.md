# no-angular-innerhtml-binding

> **Rule catalog ID:** R029

## Targeted pattern scope

Angular template bindings that write raw HTML using `[innerHTML]`.

## What this rule reports

Template fragments containing `[innerHTML]=...` bindings.

## Why this rule exists

Raw HTML bindings are high-risk unless source content is tightly sanitized and policy-reviewed.

## ❌ Incorrect

```ts
const template = `<div [innerHTML]="userHtml"></div>`;
```

## ✅ Correct

```ts
const template = `<div>{{ safeText }}</div>`;
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
