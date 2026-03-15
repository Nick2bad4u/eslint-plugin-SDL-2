# Disallow AngularJS sanitization trusted URL list mutations (no-angular-sanitization-trusted-urls)

Calls to `$compileProvider.aHrefSanitizationTrustedUrlList(...)` or
`$compileProvider.imgSrcSanitizationTrustedUrlList(...)` expand trusted URL
surfaces and should be security-reviewed.

## What this rule reports

This rule reports direct calls that mutate AngularJS trusted URL list settings:

- `$compileProvider.aHrefSanitizationTrustedUrlList(...)`
- `$compileProvider.imgSrcSanitizationTrustedUrlList(...)`

## ❌ Incorrect

```js
$compileProvider.aHrefSanitizationTrustedUrlList(/.*/);
$compileProvider.imgSrcSanitizationTrustedUrlList(/.*/);
```

## ✅ Correct

```js
// Keep default sanitizer URL handling.
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

## Further reading

- [AngularJS $compileProvider docs](https://docs.angularjs.org/api/ng/provider/$compileProvider)
- [AngularJS security guide](https://docs.angularjs.org/guide/security)
