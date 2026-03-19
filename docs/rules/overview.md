---
title: Overview
description: README-style overview for eslint-plugin-sdl-2.
---

# eslint-plugin-sdl-2

SDL-focused ESLint plugin with modern flat-config presets and TypeScript-first
rule implementations.

The plugin targets common security pitfalls and risky web/runtime APIs that are
often surfaced during security reviews.

## Installation

```bash
npm install --save-dev eslint-plugin-sdl-2
```

## Quick start (Flat Config)

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.recommended];
```

## Available presets

- `sdl.configs.common`
- `sdl.configs.typescript`
- `sdl.configs.angular`
- `sdl.configs.angularjs`
- `sdl.configs.node`
- `sdl.configs.react`
- `sdl.configs.electron`
- `sdl.configs.required`
- `sdl.configs.recommended`

See [Presets](./presets/index.md) for examples and per-preset rule tables.

## Rules

Custom rules currently documented:

- `no-angular-bypass-sanitizer`
- `no-angular-sanitization-trusted-urls`
- `no-angularjs-bypass-sce`
- `no-angularjs-enable-svg`
- `no-angularjs-sanitization-whitelist`
- `no-child-process-exec`
- `no-cookies`
- `no-document-domain`
- `no-document-execcommand-insert-html`
- `no-document-parse-html-unsafe`
- `no-document-write`
- `no-domparser-html-without-sanitization`
- `no-domparser-svg-without-sanitization`
- `no-dynamic-import-unsafe-url`
- `no-electron-allow-running-insecure-content`
- `no-electron-dangerous-blink-features`
- `no-electron-disable-context-isolation`
- `no-electron-disable-sandbox`
- `no-electron-disable-web-security`
- `no-electron-enable-webview-tag`
- `no-electron-enable-remote-module`
- `no-electron-experimental-features`
- `no-electron-expose-raw-ipc-renderer`
- `no-electron-insecure-certificate-error-handler`
- `no-electron-node-integration`
- `no-electron-permission-check-handler-allow-all`
- `no-electron-untrusted-open-external`
- `no-electron-webview-insecure-webpreferences`
- `no-html-method`
- `no-http-request-to-insecure-protocol`
- `no-iframe-srcdoc`
- `no-inner-html`
- `no-insecure-random`
- `no-insecure-tls-agent-options`
- `no-insecure-url`
- `no-location-javascript-url`
- `no-message-event-without-origin-check`
- `no-msapp-exec-unsafe`
- `no-node-tls-check-server-identity-bypass`
- `no-node-tls-legacy-protocol`
- `no-node-tls-reject-unauthorized-zero`
- `no-node-tls-security-level-zero`
- `no-node-vm-run-in-context`
- `no-node-vm-source-text-module`
- `no-node-worker-threads-eval`
- `no-nonnull-assertion-on-security-input`
- `no-postmessage-star-origin`
- `no-postmessage-without-origin-allowlist`
- `no-range-create-contextual-fragment`
- `no-script-src-data-url`
- `no-script-text`
- `no-service-worker-unsafe-script-url`
- `no-set-html-unsafe`
- `no-trusted-types-policy-pass-through`
- `no-unsafe-alloc`
- `no-unsafe-cast-to-trusted-types`
- `no-window-open-without-noopener`
- `no-winjs-html-unsafe`
- `no-worker-blob-url`
- `no-worker-data-url`

## Next steps

- Open [Getting Started](./getting-started.md).
- Review [Presets](./presets/index.md) for rollout options.
- Browse rule docs in the sidebar.
