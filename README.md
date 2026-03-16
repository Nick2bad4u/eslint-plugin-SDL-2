# eslint-plugin-sdl-2

SDL-focused ESLint plugin with modern flat-config presets and TypeScript-first rule implementations.

## Installation

```bash
npm install --save-dev eslint eslint-plugin-sdl-2
```

## Usage (Flat Config)

```ts
import sdl from "eslint-plugin-sdl-2";

export default [...sdl.configs.recommended];
```

## Presets

- `sdl.configs.common`
- `sdl.configs.typescript`
- `sdl.configs.angular`
- `sdl.configs.angularjs`
- `sdl.configs.node`
- `sdl.configs.react`
- `sdl.configs.electron`
- `sdl.configs.required`
- `sdl.configs.recommended`

## Rules

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only
- `Preset key` legend:
  - [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) — [`sdl.configs.common`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common)
  - [🔷](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/typescript) — [`sdl.configs.typescript`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/typescript)
  - [🅰️](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angular) — [`sdl.configs.angular`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angular)
  - [🧭](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angularjs) — [`sdl.configs.angularjs`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angularjs)
  - [🟩](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/node) — [`sdl.configs.node`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/node)
  - [⚛️](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/react) — [`sdl.configs.react`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/react)
  - [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) — [`sdl.configs.electron`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron)
  - [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) — [`sdl.configs.required`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required)
  - [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended) — [`sdl.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)

| Rule                                                                                                                                                           | Fix | Preset key                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`no-angular-bypass-sanitizer`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-bypass-sanitizer)                                       |  —  | [🅰️](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angular) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)  |
| [`no-angular-sanitization-trusted-urls`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angular-sanitization-trusted-urls)                     |  —  | [🅰️](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angular) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)  |
| [`no-angularjs-bypass-sce`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-bypass-sce)                                               |  —  | [🧭](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angularjs) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended) |
| [`no-angularjs-enable-svg`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-enable-svg)                                               |  —  | [🧭](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angularjs) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended) |
| [`no-angularjs-sanitization-whitelist`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-angularjs-sanitization-whitelist)                       |  —  | [🧭](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/angularjs) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended) |
| [`no-cookies`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-cookies)                                                                         |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-document-domain`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-domain)                                                         |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-document-write`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-document-write)                                                           |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-electron-allow-running-insecure-content`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-allow-running-insecure-content)         |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-dangerous-blink-features`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-dangerous-blink-features)                     |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-disable-context-isolation`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-context-isolation)                   |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-disable-sandbox`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-sandbox)                                       |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-disable-web-security`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-disable-web-security)                             |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-enable-remote-module`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-enable-remote-module)                             |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-insecure-certificate-error-handler`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-insecure-certificate-error-handler) |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-node-integration`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-node-integration)                                     |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-electron-untrusted-open-external`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-electron-untrusted-open-external)                       |  —  | [⚡](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/electron) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)   |
| [`no-html-method`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-html-method)                                                                 |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-inner-html`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-inner-html)                                                                   |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-insecure-random`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-random)                                                         |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-insecure-url`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-insecure-url)                                                               |  🔧 | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-msapp-exec-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-msapp-exec-unsafe)                                                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-node-tls-reject-unauthorized-zero`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-node-tls-reject-unauthorized-zero)                     |  —  | [🟩](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/node) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)      |
| [`no-postmessage-star-origin`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-postmessage-star-origin)                                         |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-unsafe-alloc`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-unsafe-alloc)                                                               |  —  | [🟩](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/node) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)      |
| [`no-window-open-without-noopener`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-window-open-without-noopener)                               |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |
| [`no-winjs-html-unsafe`](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/no-winjs-html-unsafe)                                                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/common) [✅](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/required) [⭐](https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules/presets/recommended)    |

## Development

```bash
npm install
npm run build
npm run lint:fix:quiet
npm run typecheck
npm run test
```
