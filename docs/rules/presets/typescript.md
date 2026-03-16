---
title: TypeScript preset
---

# 🔷 TypeScript

Use to enable TypeScript parser defaults and TypeScript-aware linting behavior.

## Config key

```ts
sdl.configs.typescript;
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.typescript];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`no-nonnull-assertion-on-security-input`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-nonnull-assertion-on-security-input) | — |
| [`no-trusted-types-policy-pass-through`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-trusted-types-policy-pass-through) | — |
| [`no-unsafe-cast-to-trusted-types`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-unsafe-cast-to-trusted-types) | — |
