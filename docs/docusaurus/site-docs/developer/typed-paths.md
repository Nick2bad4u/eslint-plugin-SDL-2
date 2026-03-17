---
title: Typed service path inventory
description: Inventory of typed parser-service and TypeScript-checker callpaths used by eslint-plugin-sdl-2.
---

# Typed service path inventory

This page inventories the current typed callpaths that can reach parser services or the TypeScript checker.

> Source document: [`docs/internal/typed-paths.md`](https://github.com/Nick2bad4u/eslint-plugin-sdl-2/blob/main/docs/internal/typed-paths.md)

## Guard model

All current typed access is **opportunistic**, not mandatory:

- `getFullTypeChecker(context)` returns a `ts.TypeChecker` only when ESLint parser services expose a full `program`.
- `hasFullTypeInformation(context)` reports whether that richer TypeScript surface is available.
- Helper functions fall back to conservative syntax-only behavior when the checker or ESTree↔TypeScript node maps are unavailable.

## Core typed helpers

| Path                                                | Typed dependency                          | Guard entry                                                                       | Fallback behavior                                                                          |
| --------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/_internal/ast-utils.ts#hasFullTypeInformation` | `parserServices.program`                  | Called directly by rules/helpers that want to know whether full TS services exist | Returns `false` when no full parser services are available                                 |
| `src/_internal/ast-utils.ts#getFullTypeChecker`     | `parserServices.program.getTypeChecker()` | Called directly from rules before optional typed checks                           | Returns `undefined`                                                                        |
| `src/_internal/ast-utils.ts#getNodeTypeAsString`    | checker + ESTree/TS node maps             | Caller passes the optional checker returned by `getFullTypeChecker`               | Returns `"any"` when the checker or maps are unavailable                                   |
| `src/_internal/ast-utils.ts#isDocumentObject`       | optional checker                          | Caller passes the optional checker returned by `getFullTypeChecker`               | Uses syntax-only checks for `document`, `window.document`, or `globalThis.window.document` |

## Current rule callpath inventory

No current SDL rule sets `meta.docs.requiresTypeChecking`. Instead, the following rules _optionally_ use type information when it exists and degrade gracefully when it does not.

### Rules with optional typed refinement

- `src/rules/no-cookies.ts`
- `src/rules/no-document-domain.ts`
- `src/rules/no-document-write.ts`
- `src/rules/no-inner-html.ts`
- `src/rules/no-insecure-random.ts`
- `src/rules/no-postmessage-star-origin.ts`

## What the typed paths do today

- **Document-object refinement** helps distinguish the browser `Document` object from unrelated identifiers.
- **Type-name checks** help confirm risky APIs such as `Window`, `Document`, `Math`, or `Crypto` before a report is emitted.
- **Syntax fallback** keeps the rules useful in non-type-aware lint runs, especially for obvious `document`, `window.document`, `Math.random`, or `postMessage("*")` patterns.

## Inventory note

This inventory intentionally reflects the current SDL plugin architecture rather than the older fork-era typed-rule framework.
