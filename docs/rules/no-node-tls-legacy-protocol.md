# no-node-tls-legacy-protocol

Disallow legacy TLS protocol selection in Node.js TLS and HTTPS configuration.

## Targeted pattern scope

This rule targets Node.js TLS and HTTPS option objects, plus assignments to
`tls.DEFAULT_MIN_VERSION` or `tls.DEFAULT_MAX_VERSION`, when they select legacy
protocols such as `TLSv1`, `TLSv1.0`, `TLSv1.1`, or legacy
`secureProtocol` values like `TLSv1_method`.

## What this rule reports

This rule reports legacy protocol selection through:

- `minVersion`
- `maxVersion`
- `secureProtocol`
- `tls.DEFAULT_MIN_VERSION`
- `tls.DEFAULT_MAX_VERSION`

## Why this rule exists

Allowing TLS 1.0 or TLS 1.1 weakens transport security and can re-enable
obsolete protocol negotiation for outbound or inbound connections. Modern Node
code should require TLS 1.2 or newer.

## ❌ Incorrect

```ts
import tls from "node:tls";
import https from "node:https";

tls.createSecureContext({ minVersion: "TLSv1.1" });
new https.Agent({ secureProtocol: "TLSv1_method" });
tls.DEFAULT_MIN_VERSION = "TLSv1";
```

## ✅ Correct

```ts
import tls from "node:tls";
import https from "node:https";

tls.createSecureContext({ minVersion: "TLSv1.2" });
new https.Agent({ secureProtocol: "TLSv1_2_method" });
tls.DEFAULT_MIN_VERSION = "TLSv1.2";
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-node-tls-legacy-protocol": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if you intentionally maintain legacy interoperability
with endpoints that cannot support TLS 1.2 or newer, and that compatibility
decision is documented and explicitly accepted as risk.

## Package documentation

- [Rule source](../../src/rules/no-node-tls-legacy-protocol.ts)

## Further reading

> **Rule catalog ID:** R058

- [Node.js TLS documentation](https://nodejs.org/api/tls.html)
- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
