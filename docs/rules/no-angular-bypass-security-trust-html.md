# no-angular-bypass-security-trust-html

Disallow Angular `bypassSecurityTrustHtml` usage that marks unvalidated HTML as trusted.

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

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-angular-bypass-security-trust-html": "error",
  },
 },
];
```

## When not to use it

Disable only if a reviewed framework boundary must return trusted HTML and the source is strictly validated before trust conversion.

## Package documentation

- [Rule source](../../src/rules/no-angular-bypass-security-trust-html.ts)

## Further reading

> **Rule catalog ID:** R028

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
