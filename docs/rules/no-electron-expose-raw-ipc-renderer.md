# no-electron-expose-raw-ipc-renderer

Disallow exposing raw Electron `ipcRenderer` objects or methods through
`contextBridge` APIs.

## Targeted pattern scope

This rule targets `contextBridge.exposeInMainWorld(...)` and
`contextBridge.exposeInIsolatedWorld(...)` calls that expose:

- `ipcRenderer` directly, or
- object properties that directly reference raw `ipcRenderer` methods.

## What this rule reports

This rule reports preload bridge exports that hand renderer code a direct IPC
primitive instead of a narrow wrapper API.

## Why this rule exists

Exposing raw IPC primitives to untrusted renderer code weakens the preload
boundary. A narrow wrapper API allows the preload layer to validate channels,
arguments, and return values before crossing trust boundaries.

## ❌ Incorrect

```ts
contextBridge.exposeInMainWorld("api", {
 send: ipcRenderer.send,
 invoke: ipcRenderer.invoke,
});
```

## ✅ Correct

```ts
contextBridge.exposeInMainWorld("api", {
 sendSettingsUpdate(payload: SettingsPayload) {
  ipcRenderer.send("settings:update", payload);
 },
});
```

## Behavior and migration notes

This rule does not autofix because the correct preload wrapper shape depends on
the channels and validation logic your application requires.

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },

  rules: {
   "sdl/no-electron-expose-raw-ipc-renderer": "error",
  },
 },
];
```

## When not to use it

Disable only if the exposed IPC surface is intentionally raw, fully reviewed,
and protected by application-specific controls outside the preload bridge.

## Package documentation

- [Rule source](../../src/rules/no-electron-expose-raw-ipc-renderer.ts)

## Further reading

> **Rule catalog ID:** R049

- [Electron context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [Electron contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge)
