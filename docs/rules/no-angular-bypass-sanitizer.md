# no-angular-bypass-sanitizer

Disallow Angular `DomSanitizer` bypass APIs that trust unvalidated content.

## Targeted pattern scope

This rule targets direct calls to Angular sanitizer bypass APIs such as:

- `bypassSecurityTrustHtml(...)`
- `bypassSecurityTrustScript(...)`
- related `bypassSecurityTrust*` methods.

## What this rule reports

This rule reports code paths that mark untrusted input as safe using
`DomSanitizer` bypass helpers.

## Why this rule exists

Bypassing Angular sanitization can convert attacker-controlled input into
trusted content and increase XSS risk.

## ❌ Incorrect

```ts
const trusted = sanitizer.bypassSecurityTrustHtml(userSuppliedHtml);
elementRef.nativeElement.innerHTML = trusted;
```

## ✅ Correct

```ts
const sanitizedHtml = sanitizer.sanitize(SecurityContext.HTML, userSuppliedHtml);
elementRef.nativeElement.textContent = sanitizedHtml ?? "";
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-angular-bypass-sanitizer": "error",
    },
  },
];
```

## When not to use it

Disable this rule only when a reviewed framework integration requires a trusted
type flow and the source is strictly controlled.

## Package documentation

- [Rule source](../../src/rules/no-angular-bypass-sanitizer.ts)

## Further reading

> **Rule catalog ID:** R001

- [Angular `DomSanitizer` security guidance](https://angular.io/api/platform-browser/DomSanitizer#security-risk)
- [Angular security guide](https://angular.io/guide/security)
