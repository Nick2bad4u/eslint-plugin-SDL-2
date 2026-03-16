---
title: Common preset
---

# 🟢 Common

Use for baseline browser/runtime security checks in JavaScript or TypeScript
projects.

## Config key

```ts
sdl.configs.common;
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.common];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule                                                                                                                             | Fix |
| -------------------------------------------------------------------------------------------------------------------------------- | :-: |
| [`no-cookies`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-cookies)                                           |  —  |
| [`no-document-domain`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-domain)                           |  —  |
| [`no-document-write`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-write)                             |  —  |
| [`no-html-method`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-html-method)                                   |  —  |
| [`no-inner-html`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-inner-html)                                     |  —  |
| [`no-insecure-random`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-random)                           |  —  |
| [`no-insecure-url`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-url)                                 |  🔧 |
| [`no-msapp-exec-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-msapp-exec-unsafe)                       |  —  |
| [`no-postmessage-star-origin`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-postmessage-star-origin)           |  —  |
| [`no-window-open-without-noopener`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-window-open-without-noopener) |  —  |
| [`no-winjs-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-winjs-html-unsafe)                       |  —  |
