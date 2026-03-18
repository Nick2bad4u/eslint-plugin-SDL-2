# no-iframe-srcdoc

Disallow populating `iframe.srcdoc` with inline HTML documents.

## Targeted pattern scope

This rule targets:

- `iframe.srcdoc = ...`
- `iframe.setAttribute("srcdoc", ...)`
- `<iframe srcDoc={...} />` in JSX.

## What this rule reports

This rule reports inline iframe document creation through `srcdoc` writes and
JSX `srcDoc` attributes.

## Why this rule exists

`srcdoc` embeds a full HTML document directly into the page. That increases the
risk of shipping unsafe inline markup, weakens review boundaries compared with a
separate reviewed document URL, and makes it easier to introduce script-capable
content in places that look like simple attribute assignments.

## ❌ Incorrect

```ts
iframe.srcdoc = userHtml;
```

```tsx
const frame = <iframe srcDoc={userHtml} />;
```

## ✅ Correct

```ts
iframe.src = "https://example.com/embed.html";
```

```tsx
const frame = <iframe src="https://example.com/embed.html" />;
```

## ESLint flat config example

```ts
import sdl from "eslint-plugin-sdl-2";

export default [
 {
  plugins: { sdl },
  rules: {
   "sdl/no-iframe-srcdoc": "error",
  },
 },
];
```

## When not to use it

Disable only if your application intentionally serves inline iframe documents,
those documents are tightly controlled, and a reviewed sandboxing strategy
exists outside this rule.

## Package documentation

- [Rule source](../../src/rules/no-iframe-srcdoc.ts)

## Further reading

> **Rule catalog ID:** R053

- [MDN: `HTMLIFrameElement.srcdoc`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc)
- [MDN: `<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)
- [OWASP Cross Site Scripting Prevention Cheat Sheet](https://owasp.org/www-community/xss-prevention)
