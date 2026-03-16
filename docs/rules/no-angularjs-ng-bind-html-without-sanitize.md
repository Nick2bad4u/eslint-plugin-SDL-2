# no-angularjs-ng-bind-html-without-sanitize

> **Rule catalog ID:** R030

## Targeted pattern scope

AngularJS templates using `ng-bind-html` without explicit sanitize context.

## What this rule reports

`ng-bind-html` usage in template strings that do not indicate sanitize support.

## Why this rule exists

Unsafe HTML binding in AngularJS can lead to reflected or stored XSS.

## ❌ Incorrect

```ts

const template = `<div ng-bind-html="unsafeHtml"></div>`;

```

## ✅ Correct

```ts

const template = `<div ng-bind-html="trustedHtml" ngSanitize></div>`;

```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
