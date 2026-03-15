---
sidebar_position: 2
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-sdl-2
```

Then enable it in your Flat Config:

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
    ...sdl.configs.recommended,
];
```

## Recommended approach

- Start with `...sdl.configs.recommended`.
- Fix violations in small batches.
- Promote warnings to errors after stabilization.

You can layer additional presets as needed:

- `...sdl.configs.common`
- `...sdl.configs.angular`
- `...sdl.configs.angularjs`
- `...sdl.configs.node`
- `...sdl.configs.react`
- `...sdl.configs.electron`

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs synced from the repository.
