# no-electron-unchecked-ipc-sender

> **Rule catalog ID:** R036

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
ipcMain.handle("read-file", async (event) => { if (!event.senderFrame?.url?.startsWith("https://example.com")) return null; return "ok"; });
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
