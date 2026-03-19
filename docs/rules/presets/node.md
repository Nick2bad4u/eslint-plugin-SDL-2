---
title: Node preset
---

# 🟩 Node

Use for Node.js-specific runtime safety checks.

## Config key

```ts
sdl.configs.node;
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.node];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`no-child-process-exec`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-child-process-exec) | — |
| [`no-child-process-shell-true`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-child-process-shell-true) | — |
| [`no-http-request-to-insecure-protocol`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-http-request-to-insecure-protocol) | 🔧 |
| [`no-insecure-tls-agent-options`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-insecure-tls-agent-options) | 🔧 |
| [`no-node-tls-check-server-identity-bypass`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-tls-check-server-identity-bypass) | — |
| [`no-node-tls-legacy-protocol`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-tls-legacy-protocol) | — |
| [`no-node-tls-reject-unauthorized-zero`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-tls-reject-unauthorized-zero) | 💡 |
| [`no-node-tls-security-level-zero`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-tls-security-level-zero) | — |
| [`no-node-vm-run-in-context`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-vm-run-in-context) | — |
| [`no-node-vm-source-text-module`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-vm-source-text-module) | — |
| [`no-node-worker-threads-eval`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-node-worker-threads-eval) | — |
| [`no-unsafe-alloc`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-unsafe-alloc) | 🔧 |
