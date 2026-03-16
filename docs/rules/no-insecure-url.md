# no-insecure-url

Disallow insecure URL protocols in application code.

## Targeted pattern scope

This rule targets insecure URL patterns such as:

- `http://...`
- `ftp://...`
- configurable blocklisted patterns defined in rule options.

## What this rule reports

This rule reports string literals and option-matched values that use insecure
or explicitly blocked URL schemes.

## Why this rule exists

Unencrypted transports can expose credentials, tokens, and sensitive payloads
to interception or tampering.

## ❌ Incorrect

```ts
const endpoint = "http://api.example.com/v1/data";
```

## ✅ Correct

```ts
const endpoint = "https://api.example.com/v1/data";
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-insecure-url": [
    "error",
    {
     blocklist: ["^(http|ftp):\\/\\/"],
     exceptions: ["^http:\\/\\/schemas\\.microsoft\\.com\\/?.*"],
     varExceptions: ["insecure?.*"],
    },
   ],
  },
 },
];
```

## When not to use it

Disable only when scanning datasets or tests that intentionally include insecure
URLs.

## Package documentation

- [Rule source](../../src/rules/no-insecure-url.ts)

## Further reading

> **Rule catalog ID:** R021

- [MDN: HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
- [DevSkim DS137138 guidance](https://github.com/microsoft/DevSkim/blob/main/guidance/DS137138.md)
- [CodeQL insecure download guidance](https://codeql.github.com/codeql-query-help/javascript/js-clear-text-logging-sensitive-info/)
