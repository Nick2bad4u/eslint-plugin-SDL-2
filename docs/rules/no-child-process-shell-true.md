# no-child-process-shell-true

> **Rule catalog ID:** R032

## Targeted pattern scope

Node child_process execution options that enable `shell: true`.

## What this rule reports

`spawn(...)` / `execFile(...)` options objects with `shell: true`.

## Why this rule exists

Shell execution expands injection risk when command fragments include user-influenced input.

## ❌ Incorrect

```ts
spawn("cmd", ["/c", command], { shell: true });
```

## ✅ Correct

```ts
spawn("node", ["script.js"], { shell: false });
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
