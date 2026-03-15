# no-insecure-random

Disallow non-cryptographic randomness APIs for security-sensitive flows.

## Targeted pattern scope

This rule targets insecure randomness APIs such as:

- `Math.random()`
- `crypto.pseudoRandomBytes(...)`.

## What this rule reports

This rule reports pseudo-random generators used in contexts where
cryptographic-strength randomness is expected.

## Why this rule exists

Predictable random values can undermine tokens, passwords, keys, and related
security controls.

## ❌ Incorrect

```ts
const token = `${Math.random()}`;
const bytes = crypto.pseudoRandomBytes(32);
```

## ✅ Correct

```ts
const bytes = crypto.randomBytes(32);
const browserBytes = crypto.getRandomValues(new Uint8Array(32));
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-insecure-random": "error",
    },
  },
];
```

## When not to use it

Disable only for non-security simulation or test data where predictability is
acceptable.

## Package documentation

- [Rule source](../../src/rules/no-insecure-random.ts)

## Further reading

> **Rule catalog ID:** R212

- [OWASP: Insecure randomness](https://owasp.org/www-community/vulnerabilities/Insecure_Randomness)
- [CodeQL query help: Insecure randomness](https://codeql.github.com/codeql-query-help/javascript/js-insecure-randomness/)
- [Sonar rule RSPEC-2245](https://rules.sonarsource.com/javascript/RSPEC-2245)
