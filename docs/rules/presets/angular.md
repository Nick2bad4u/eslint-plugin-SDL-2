---
title: Angular preset
---

# 🅰️ Angular

Use for Angular-focused security rules.

## Config key

```ts
sdl.configs.angular;
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.angular];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`no-angular-bypass-sanitizer`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-bypass-sanitizer) | — |
| [`no-angular-bypass-security-trust-html`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-bypass-security-trust-html) | — |
| [`no-angular-innerhtml-binding`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-innerhtml-binding) | — |
| [`no-angular-sanitization-trusted-urls`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-sanitization-trusted-urls) | — |
