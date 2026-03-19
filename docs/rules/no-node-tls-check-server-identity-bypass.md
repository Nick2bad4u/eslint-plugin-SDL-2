# no-node-tls-check-server-identity-bypass

Disallow Node.js `checkServerIdentity` overrides that always accept the peer hostname.

## Targeted pattern scope

This rule targets Node.js TLS/HTTPS/http2 option objects, plus assignments to
`tls.checkServerIdentity`, when the configured callback always succeeds by:

- using an empty function body
- returning `undefined`
- returning `null`
- returning `void ...`

## What this rule reports

This rule reports `checkServerIdentity` implementations that suppress hostname
verification instead of delegating to `tls.checkServerIdentity(...)` or a
reviewed stronger verification path.

## Why this rule exists

Overriding `checkServerIdentity` is a security-sensitive escape hatch. A
callback that always returns success disables hostname validation and can allow
connections to certificates that do not match the expected server identity.

## ❌ Incorrect

```ts
import https from "node:https";
import tls from "node:tls";

https.request({
 checkServerIdentity() {},
});

tls.checkServerIdentity = () => undefined;
```

## ✅ Correct

```ts
import https from "node:https";
import tls from "node:tls";

https.request({
 checkServerIdentity(hostname, cert) {
  return tls.checkServerIdentity(hostname, cert);
 },
});
```

## Behavior and migration notes

This rule intentionally reports only specific unsafe callback shapes. More
complex certificate pinning or hostname validation logic is not analyzed.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-node-tls-check-server-identity-bypass": "error",
  },
 },
];
```

## When not to use it

Disable this rule only if your codebase has a reviewed custom
`checkServerIdentity` implementation and this rule's narrow syntactic heuristic
still flags that approved pattern.

## Package documentation

- [Rule source](../../src/rules/no-node-tls-check-server-identity-bypass.ts)

## Further reading

> **Rule catalog ID:** R061

- [Node.js TLS documentation: `checkServerIdentity`](https://nodejs.org/api/tls.html#tlscheckserveridentityhostname-cert)
- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
