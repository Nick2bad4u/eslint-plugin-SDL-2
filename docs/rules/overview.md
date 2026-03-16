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
- `no-cookies`
- `no-document-domain`
- `no-document-write`
- `no-electron-allow-running-insecure-content`
- `no-electron-dangerous-blink-features`
- `no-electron-disable-context-isolation`
- `no-electron-disable-sandbox`
- `no-electron-disable-web-security`
- `no-electron-enable-remote-module`
- `no-electron-insecure-certificate-error-handler`
- `no-electron-node-integration`
- `no-electron-untrusted-open-external`
- `no-html-method`
- `no-inner-html`
- `no-insecure-random`
- `no-insecure-url`
- `no-msapp-exec-unsafe`
- `no-node-tls-reject-unauthorized-zero`
- `no-postmessage-star-origin`
- `no-unsafe-alloc`
- `no-window-open-without-noopener`
- `no-winjs-html-unsafe`

## Next steps

- Open [Getting Started](./getting-started.md).
- Review [Presets](./presets/index.md) for rollout options.
- Browse rule docs in the sidebar.
