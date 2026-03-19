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

| Rule | Fix |
| --- | :-: |
| [`no-cookies`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-cookies) | — |
| [`no-document-domain`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-document-domain) | — |
| [`no-document-execcommand-insert-html`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-document-execcommand-insert-html) | — |
| [`no-document-parse-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-document-parse-html-unsafe) | — |
| [`no-document-write`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-document-write) | — |
| [`no-domparser-html-without-sanitization`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-domparser-html-without-sanitization) | — |
| [`no-domparser-svg-without-sanitization`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-domparser-svg-without-sanitization) | — |
| [`no-dynamic-import-unsafe-url`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-dynamic-import-unsafe-url) | — |
| [`no-html-method`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-html-method) | — |
| [`no-iframe-srcdoc`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-iframe-srcdoc) | — |
| [`no-inner-html`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-inner-html) | — |
| [`no-insecure-random`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-insecure-random) | — |
| [`no-insecure-url`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-insecure-url) | 🔧 |
| [`no-location-javascript-url`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-location-javascript-url) | — |
| [`no-message-event-without-origin-check`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-message-event-without-origin-check) | — |
| [`no-msapp-exec-unsafe`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-msapp-exec-unsafe) | — |
| [`no-postmessage-star-origin`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-postmessage-star-origin) | 💡 |
| [`no-postmessage-without-origin-allowlist`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-postmessage-without-origin-allowlist) | — |
| [`no-range-create-contextual-fragment`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-range-create-contextual-fragment) | — |
| [`no-script-src-data-url`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-script-src-data-url) | — |
| [`no-script-text`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-script-text) | — |
| [`no-service-worker-unsafe-script-url`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-service-worker-unsafe-script-url) | — |
| [`no-set-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-set-html-unsafe) | — |
| [`no-window-open-without-noopener`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-window-open-without-noopener) | — |
| [`no-winjs-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-winjs-html-unsafe) | — |
| [`no-worker-blob-url`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-worker-blob-url) | — |
| [`no-worker-data-url`](https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules/no-worker-data-url) | — |
