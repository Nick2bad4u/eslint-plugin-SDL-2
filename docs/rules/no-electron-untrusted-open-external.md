# no-electron-untrusted-open-external

Disallow untrusted or unsafe protocols in Electron `shell.openExternal(...)` calls.

## Targeted pattern scope

This rule targets direct `shell.openExternal(...)` and
`electron.shell.openExternal(...)` call sites.

## What this rule reports

This rule reports `shell.openExternal(...)` calls when the URL argument is
non-literal, dynamically constructed, or uses a protocol other than `https:` or
`mailto:`.

## Why this rule exists

`openExternal` launches external handlers and browsers. Passing untrusted or
unexpected URLs can create phishing or command-surface abuse paths.

## ❌ Incorrect

```ts
shell.openExternal("http://example.com");
shell.openExternal(userProvidedUrl);
shell.openExternal(`https://${host}`);
```

## ✅ Correct

```ts
shell.openExternal("https://example.com/docs");
shell.openExternal("mailto:security@example.com");
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-electron-untrusted-open-external": "error",
    },
  },
];
```

## When not to use it

Disable if your project uses a centralized URL-validation helper and dynamic
values are already strictly validated before `openExternal`.

## Package documentation

- [Rule source](../../src/rules/no-electron-untrusted-open-external.ts)

## Further reading

> **Rule catalog ID:** R017

- [Electron shell.openExternal](https://www.electronjs.org/docs/latest/api/shell#shellopenexternalurl-options)
- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
