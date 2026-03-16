---
title: Getting Started
description: Enable eslint-plugin-sdl-2 quickly in Flat Config.
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-sdl-2
```

Enable one preset in your Flat Config:

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.recommended];
```

## Layering presets

`recommended` already includes:

- browser/security baseline (`common`)
- framework/runtime overlays (`angular`, `angularjs`, `electron`, `node`)
- TypeScript parser integration (`typescript`)

## Alternative: manual scoped setup

If you prefer to apply plugin rules inside your own file-scoped config object, spread the preset rules manually.

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 ...sdl.configs.typescript,
 {
  files: ["**/*.{ts,tsx,mts,cts}"],
  plugins: {
   sdl,
  },
  rules: {
   "sdl/no-insecure-random": "error",
   "sdl/no-insecure-url": "error",
  },
 },
];
```

Use this pattern only when you need strict per-glob control. In most projects,
prefer `...sdl.configs.<preset>` directly.

## Recommended rollout

1. Start with `...sdl.configs.recommended`.
2. Fix violations in small batches.
3. Add framework/runtime presets (`angular`, `react`, `electron`, etc.) as
   needed.
4. Keep `typescript` enabled for TS projects.

## Need a narrower subset?

- Use `...sdl.configs.common` for browser-centric checks.
- Use `...sdl.configs.node` for Node-specific checks.
- Use `...sdl.configs.angular` / `...sdl.configs.angularjs` for framework
  overlays.

See [Presets](./presets/index.md) for full examples and rules per preset.
