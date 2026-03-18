---
title: Recommended preset
---

# ⭐ Recommended

Use as the default baseline for most projects.

## Config key

```ts
sdl.configs.recommended;
```

## Flat Config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.recommended];
```

This preset includes all rules from `required` plus TypeScript parser setup.

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
| [`no-angularjs-bypass-sce`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-bypass-sce) | — |
| [`no-angularjs-enable-svg`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-enable-svg) | — |
| [`no-angularjs-ng-bind-html-without-sanitize`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-ng-bind-html-without-sanitize) | — |
| [`no-angularjs-sanitization-whitelist`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-sanitization-whitelist) | — |
| [`no-angularjs-sce-resource-url-wildcard`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-sce-resource-url-wildcard) | — |
| [`no-child-process-shell-true`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-child-process-shell-true) | — |
| [`no-cookies`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-cookies) | — |
| [`no-document-domain`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-domain) | — |
| [`no-document-parse-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-parse-html-unsafe) | — |
| [`no-document-write`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-write) | — |
| [`no-domparser-html-without-sanitization`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-domparser-html-without-sanitization) | — |
| [`no-electron-allow-running-insecure-content`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-allow-running-insecure-content) | 🔧 |
| [`no-electron-dangerous-blink-features`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-dangerous-blink-features) | — |
| [`no-electron-disable-context-isolation`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-context-isolation) | 🔧 |
| [`no-electron-disable-sandbox`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-sandbox) | 🔧 |
| [`no-electron-disable-web-security`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-web-security) | 🔧 |
| [`no-electron-enable-remote-module`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-enable-remote-module) | 🔧 |
| [`no-electron-enable-webview-tag`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-enable-webview-tag) | 🔧 |
| [`no-electron-experimental-features`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-experimental-features) | 🔧 |
| [`no-electron-expose-raw-ipc-renderer`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-expose-raw-ipc-renderer) | — |
| [`no-electron-insecure-certificate-error-handler`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-insecure-certificate-error-handler) | — |
| [`no-electron-insecure-certificate-verify-proc`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-insecure-certificate-verify-proc) | — |
| [`no-electron-insecure-permission-request-handler`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-insecure-permission-request-handler) | — |
| [`no-electron-node-integration`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-node-integration) | 🔧 |
| [`no-electron-permission-check-handler-allow-all`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-permission-check-handler-allow-all) | — |
| [`no-electron-unchecked-ipc-sender`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-unchecked-ipc-sender) | — |
| [`no-electron-unrestricted-navigation`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-unrestricted-navigation) | — |
| [`no-electron-untrusted-open-external`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-untrusted-open-external) | — |
| [`no-electron-webview-allowpopups`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-webview-allowpopups) | 🔧 |
| [`no-electron-webview-insecure-webpreferences`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-webview-insecure-webpreferences) | — |
| [`no-electron-webview-node-integration`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-webview-node-integration) | 🔧 |
| [`no-html-method`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-html-method) | — |
| [`no-http-request-to-insecure-protocol`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-http-request-to-insecure-protocol) | 🔧 |
| [`no-iframe-srcdoc`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-iframe-srcdoc) | — |
| [`no-inner-html`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-inner-html) | — |
| [`no-insecure-random`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-random) | — |
| [`no-insecure-tls-agent-options`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-tls-agent-options) | 🔧 |
| [`no-insecure-url`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-url) | 🔧 |
| [`no-location-javascript-url`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-location-javascript-url) | — |
| [`no-message-event-without-origin-check`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-message-event-without-origin-check) | — |
| [`no-msapp-exec-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-msapp-exec-unsafe) | — |
| [`no-node-tls-legacy-protocol`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-node-tls-legacy-protocol) | — |
| [`no-node-tls-reject-unauthorized-zero`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-node-tls-reject-unauthorized-zero) | 💡 |
| [`no-node-tls-security-level-zero`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-node-tls-security-level-zero) | — |
| [`no-nonnull-assertion-on-security-input`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-nonnull-assertion-on-security-input) | — |
| [`no-postmessage-star-origin`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-postmessage-star-origin) | 💡 |
| [`no-postmessage-without-origin-allowlist`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-postmessage-without-origin-allowlist) | — |
| [`no-range-create-contextual-fragment`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-range-create-contextual-fragment) | — |
| [`no-script-text`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-script-text) | — |
| [`no-set-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-set-html-unsafe) | — |
| [`no-trusted-types-policy-pass-through`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-trusted-types-policy-pass-through) | — |
| [`no-unsafe-alloc`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-unsafe-alloc) | 🔧 |
| [`no-unsafe-cast-to-trusted-types`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-unsafe-cast-to-trusted-types) | — |
| [`no-window-open-without-noopener`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-window-open-without-noopener) | — |
| [`no-winjs-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-winjs-html-unsafe) | — |
