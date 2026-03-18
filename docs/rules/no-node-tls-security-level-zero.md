# no-node-tls-security-level-zero

Disallow lowering Node.js TLS cipher security to OpenSSL security level `0`.

## Targeted pattern scope

This rule targets Node.js TLS and HTTPS option objects, plus assignments to
`tls.DEFAULT_CIPHERS`, when the configured cipher string explicitly lowers the
OpenSSL security level to `@SECLEVEL=0`.

## What this rule reports

This rule reports TLS cipher configuration through:

- `ciphers`
- `tls.DEFAULT_CIPHERS`

when the configured string contains `@SECLEVEL=0`.

## Why this rule exists

Lowering the OpenSSL security level to `0` weakens the TLS handshake policy and
can re-enable deprecated or unsafe cipher negotiation behavior. Node's default
TLS cipher policy is safer than explicitly downgrading to security level `0`.

## ❌ Incorrect

```ts
import https from "node:https";
import tls from "node:tls";

tls.createSecureContext({ ciphers: "DEFAULT@SECLEVEL=0" });
new https.Agent({ ciphers: "DEFAULT:@SECLEVEL=0" });
tls.DEFAULT_CIPHERS = "DEFAULT@SECLEVEL=0";
```

## ✅ Correct

```ts
import https from "node:https";
import tls from "node:tls";

tls.createSecureContext({ ciphers: "DEFAULT" });
new https.Agent({ ciphers: "DEFAULT" });
tls.DEFAULT_CIPHERS = "DEFAULT";
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-node-tls-security-level-zero": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if you intentionally accept the risk of lowering OpenSSL
security policy for a documented legacy interoperability requirement.

## Package documentation

- [Rule source](../../src/rules/no-node-tls-security-level-zero.ts)

## Further reading

> **Rule catalog ID:** R059

- [Node.js TLS documentation](https://nodejs.org/api/tls.html)
- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
