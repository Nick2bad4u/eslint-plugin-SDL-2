# no-angular-sanitization-trusted-urls

Disallow AngularJS trusted URL list mutations that weaken sanitizer defaults.

## Targeted pattern scope

This rule targets calls that mutate AngularJS trusted URL list settings:

- `$compileProvider.aHrefSanitizationTrustedUrlList(...)`
- `$compileProvider.imgSrcSanitizationTrustedUrlList(...)`.

## What this rule reports

This rule reports direct calls that broaden which URL patterns AngularJS treats
as trusted for links and image sources.

## Why this rule exists

Relaxing trusted URL lists can enable unsafe protocols or domains and increase
XSS and data exfiltration risk.

## ❌ Incorrect

```ts
$compileProvider.aHrefSanitizationTrustedUrlList(/.*/);
$compileProvider.imgSrcSanitizationTrustedUrlList(/.*/);
```

## ✅ Correct

```ts
// Keep framework defaults unless a narrow, reviewed allow-list is required.
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
    {
        plugins: { sdl },
        rules: {
            "sdl/no-angular-sanitization-trusted-urls": "error",
        },
    },
];
```

## When not to use it

Disable only for legacy AngularJS deployments where URL list updates are
strictly reviewed and monitored.

## Package documentation

- [Rule source](../../src/rules/no-angular-sanitization-trusted-urls.ts)

## Further reading

> **Rule catalog ID:** R002

- [AngularJS `$compileProvider` API](https://docs.angularjs.org/api/ng/provider/%24compileProvider)
- [AngularJS security guide](https://docs.angularjs.org/guide/security)
