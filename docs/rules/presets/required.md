---
title: Required preset
---

# ✅ Required

Use when you want all mandatory SDL checks without the TypeScript helper layer.

## Config key

```ts
sdl.configs.required
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.required];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule                                                                                                                                       | Fix |
| ------------------------------------------------------------------------------------------------------------------------------------------ | :-: |
| [`no-angular-bypass-sanitizer`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-bypass-sanitizer)                   |  —  |
| [`no-angular-sanitization-trusted-urls`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-sanitization-trusted-urls) |  —  |
| [`no-angularjs-bypass-sce`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-bypass-sce)                           |  —  |
| [`no-angularjs-enable-svg`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-enable-svg)                           |  —  |
| [`no-angularjs-sanitization-whitelist`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-sanitization-whitelist)   |  —  |
| [`no-cookies`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-cookies)                                                     |  —  |
| [`no-document-domain`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-domain)                                     |  —  |
| [`no-document-write`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-write)                                       |  —  |
| [`no-electron-node-integration`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-node-integration)                 |  —  |
| [`no-html-method`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-html-method)                                             |  —  |
| [`no-inner-html`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-inner-html)                                               |  —  |
| [`no-insecure-random`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-random)                                     |  —  |
| [`no-insecure-url`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-url)                                           |  🔧 |
| [`no-msapp-exec-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-msapp-exec-unsafe)                                 |  —  |
| [`no-postmessage-star-origin`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-postmessage-star-origin)                     |  —  |
| [`no-unsafe-alloc`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-unsafe-alloc)                                           |  —  |
| [`no-winjs-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-winjs-html-unsafe)                                 |  —  |
