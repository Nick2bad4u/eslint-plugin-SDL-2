# no-angularjs-sce-resource-url-wildcard

Disallow wildcard AngularJS SCE resource URL whitelist entries.

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
$sceDelegateProvider.resourceUrlWhitelist([
 "self",
 "https://cdn.example.com/app",
]);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-angularjs-sce-resource-url-wildcard": "error",
  },
 },
];
```

## When not to use it

Disable only if wildcard resource URLs are part of a reviewed legacy exception with strong compensating controls.

## Package documentation

- [Rule source](../../src/rules/no-angularjs-sce-resource-url-wildcard.ts)

## Further reading

> **Rule catalog ID:** R031

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
