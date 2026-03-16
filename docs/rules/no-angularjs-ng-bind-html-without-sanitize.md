# no-angularjs-ng-bind-html-without-sanitize

Disallow AngularJS `ng-bind-html` usage when sanitization is not explicit.

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

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-angularjs-ng-bind-html-without-sanitize": "error",
  },
 },
];
```

## When not to use it

Disable only if the project has explicit AngularJS sanitization controls and a reviewed HTML trust pipeline.

## Package documentation

- [Rule source](../../src/rules/no-angularjs-ng-bind-html-without-sanitize.ts)

## Further reading

> **Rule catalog ID:** R030

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
