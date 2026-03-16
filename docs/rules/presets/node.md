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

| Rule                                                                                                                                       | Fix |
| ------------------------------------------------------------------------------------------------------------------------------------------ | :-: |
| [`no-node-tls-reject-unauthorized-zero`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-node-tls-reject-unauthorized-zero) |  —  |
| [`no-unsafe-alloc`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-unsafe-alloc)                                           |  —  |
