# no-http-request-to-insecure-protocol

> **Rule catalog ID:** R040

## Targeted pattern scope

Network client calls to insecure `http://` endpoints.

## What this rule reports

`http`/`https`/`fetch` calls whose URL literal starts with `http://`.

## Why this rule exists

Unencrypted HTTP can expose credentials, tokens, and payload integrity to active network attackers.

## ❌ Incorrect

```ts
http.get("http://api.example.com/status");
```

## ✅ Correct

```ts
https.get("https://api.example.com/status");
```

## Further reading

- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)
- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)
