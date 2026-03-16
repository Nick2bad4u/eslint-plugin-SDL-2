# no-angularjs-sce-resource-url-wildcard

> **Rule catalog ID:** R031

## Targeted pattern scope

AngularJS SCE whitelist configurations using wildcard entries.

## What this rule reports

`resourceUrlWhitelist([...])` entries that contain wildcard values.

## Why this rule exists

Wildcard resource URL allowlists can over-trust unreviewed remote origins.

## ❌ Incorrect

```ts
$sceDelegateProvider.resourceUrlWhitelist(["self", "*"]);
```

## ✅ Correct

```ts
$sceDelegateProvider.resourceUrlWhitelist(["self", "https://cdn.example.com/app"]);
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
