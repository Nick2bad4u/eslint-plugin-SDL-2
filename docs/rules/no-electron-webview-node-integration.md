# no-electron-webview-node-integration

Disallow Electron `<webview>` configurations that enable node integration.

## Targeted pattern scope

Electron `<webview>` configurations enabling node integration flags.

## What this rule reports

`webview` `nodeintegration`/`nodeintegrationinsubframes`/`webpreferences` node-integration flags.

## Why this rule exists

Node integration in untrusted renderer contexts can break isolation and enable code-execution paths.

## ❌ Incorrect

```ts
const view = <webview nodeintegration src="https://example.com" />;
```

## ✅ Correct

```ts
const view = <webview src="https://example.com" webpreferences="sandbox=yes" />;
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-webview-node-integration": "error",
  },
 },
];
```

## When not to use it

Disable only for legacy webview flows with documented trust guarantees and compensating isolation controls.

## Package documentation

- [Rule source](../../src/rules/no-electron-webview-node-integration.ts)

## Further reading

> **Rule catalog ID:** R039

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
