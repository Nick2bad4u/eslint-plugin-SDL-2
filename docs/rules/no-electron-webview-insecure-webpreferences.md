# no-electron-webview-insecure-webpreferences

Disallow unsafe Electron `<webview>` `webpreferences` string flags.

## Targeted pattern scope

This rule targets static `<webview webpreferences="..." />` attributes that
enable insecure flags such as:

- `allowRunningInsecureContent=yes`
- `contextIsolation=no`
- `experimentalFeatures=yes`
- `sandbox=no`
- `webSecurity=no`

## What this rule reports

This rule reports static `webpreferences` strings on Electron `webview`
elements when they contain unsafe hardening overrides.

## Why this rule exists

Electron `webview` attributes often hide security-critical renderer settings
inside string flags. Those strings can quietly disable isolation or enable risky
behavior that should stay off for untrusted content.

## ❌ Incorrect

```tsx
const view = (
 <webview
  src="https://example.com"
  webpreferences="webSecurity=no, contextIsolation=no"
 />
);
```

## ✅ Correct

```tsx
const view = (
 <webview
  src="https://example.com"
  webpreferences="sandbox=yes, contextIsolation=yes, webSecurity=yes"
 />
);
```

## Behavior and migration notes

This rule currently reports only static string values. Dynamic `webpreferences`
expressions are ignored to avoid false positives.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-webview-insecure-webpreferences": "error",
  },
 },
];
```

## When not to use it

Disable only if reviewed `webview` content requires these flags and the host
application enforces compensating controls elsewhere.

## Package documentation

- [Rule source](../../src/rules/no-electron-webview-insecure-webpreferences.ts)

## Further reading

> **Rule catalog ID:** R051

- [Electron `<webview>` tag](https://www.electronjs.org/docs/latest/api/webview-tag)
- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
