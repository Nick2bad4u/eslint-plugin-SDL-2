---
title: AngularJS preset
---

# 🧭 AngularJS

Use for AngularJS-specific sanitization and SCE policy rules.

## Config key

```ts
sdl.configs.angularjs;
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.angularjs];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`no-angularjs-bypass-sce`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-bypass-sce) | — |
| [`no-angularjs-enable-svg`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-enable-svg) | — |
| [`no-angularjs-ng-bind-html-without-sanitize`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-ng-bind-html-without-sanitize) | — |
| [`no-angularjs-sanitization-whitelist`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-sanitization-whitelist) | — |
| [`no-angularjs-sce-resource-url-wildcard`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-angularjs-sce-resource-url-wildcard) | — |
