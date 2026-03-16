# no-node-tls-reject-unauthorized-zero

Disallow `process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"` in Node.js code.

## Targeted pattern scope

This rule targets assignment expressions that set
`process.env.NODE_TLS_REJECT_UNAUTHORIZED` to `0` or `"0"`.

## What this rule reports

This rule reports assignments that disable TLS certificate verification through
`NODE_TLS_REJECT_UNAUTHORIZED`.

## Why this rule exists

Disabling certificate validation removes server identity verification and
introduces man-in-the-middle risk for outbound TLS connections.

## ❌ Incorrect

```ts
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```

## ✅ Correct

```ts
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-node-tls-reject-unauthorized-zero": "error",
  },
 },
];
```

## When not to use it

Disable only in tightly controlled local debugging contexts where no production
or shared environment can inherit the override.

## Package documentation

- [Rule source](../../src/rules/no-node-tls-reject-unauthorized-zero.ts)

## Further reading

> **Rule catalog ID:** R023

- [Node.js environment variables](https://nodejs.org/api/cli.html#environment-variables)
- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
