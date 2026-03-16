# no-document-write

Disallow direct DOM writes through `document.write` and `document.writeln`.

## Targeted pattern scope

This rule targets:

- `document.write(...)`
- `document.writeln(...)`.

## What this rule reports

This rule reports direct document stream writes that inject HTML into the page.

## Why this rule exists

`document.write` APIs are prone to injection and can overwrite document state in
unpredictable ways.

## ❌ Incorrect

```ts
document.write(`<div>${userInput}</div>`);
```

## ✅ Correct

```ts
const node = document.createElement("div");
node.textContent = userInput;
document.body.append(node);
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
  {
    plugins: { sdl },
    rules: {
      "sdl/no-document-write": "error",
    },
  },
];
```

## When not to use it

Disable only in controlled legacy rendering flows that cannot migrate from
document stream writes.

## Package documentation

- [Rule source](../../src/rules/no-document-write.ts)

## Further reading

> **Rule catalog ID:** R008

- [MDN: `document.write`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write)
- [Legacy rule inspiration](https://github.com/microsoft/tslint-microsoft-contrib/blob/master/src/noDocumentWriteRule.ts)
