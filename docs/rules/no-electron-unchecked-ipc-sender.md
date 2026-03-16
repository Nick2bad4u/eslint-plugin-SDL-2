# no-electron-unchecked-ipc-sender

Disallow privileged Electron IPC handlers that do not validate the sender.

## Targeted pattern scope

`ipcMain.on`/`ipcMain.handle` callbacks without sender/frame trust validation.

## What this rule reports

Privileged IPC handlers that process requests without checking sender origin/frame trust.

## Why this rule exists

Unvalidated IPC senders can let compromised renderers invoke privileged main-process operations.

## ❌ Incorrect

```ts
ipcMain.handle("read-file", async (event) => readFile("secret.txt"));
```

## ✅ Correct

```ts
ipcMain.handle("read-file", async (event) => {
 if (!event.senderFrame?.url?.startsWith("https://example.com")) return null;
 return "ok";
});
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-unchecked-ipc-sender": "error",
  },
 },
];
```

## When not to use it

Disable only if IPC sender trust is enforced by a reviewed abstraction that this rule cannot currently observe.

## Package documentation

- [Rule source](../../src/rules/no-electron-unchecked-ipc-sender.ts)

## Further reading

> **Rule catalog ID:** R036

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)

- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
