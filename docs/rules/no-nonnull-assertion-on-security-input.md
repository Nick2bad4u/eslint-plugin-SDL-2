# no-nonnull-assertion-on-security-input

> **Rule catalog ID:** R043

## Targeted pattern scope

TypeScript non-null assertions on security-sensitive input values.

## What this rule reports

TS non-null assertions on identifiers/properties with security-sensitive names.

## Why this rule exists

Non-null assertions can hide validation gaps and bypass defensive checks on attacker-controlled input.

## ❌ Incorrect

```ts
const safe = userInput!;
```

## ✅ Correct

```ts
const safe = validateInput(userInput);
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
