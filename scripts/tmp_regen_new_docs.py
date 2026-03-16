from __future__ import annotations

from pathlib import Path

DOCS: list[dict[str, str]] = [
    {
        "name": "no-angular-bypass-security-trust-html",
        "id": "R028",
        "scope": "Angular DomSanitizer bypass APIs for HTML trust.",
        "report": "Calls to `bypassSecurityTrustHtml(...)`.",
        "why": "Bypassing Angular sanitization for HTML can introduce XSS if values are not strictly validated.",
        "bad": "const trusted = sanitizer.bypassSecurityTrustHtml(userHtml);",
        "good": "const trusted = sanitizer.sanitize(SecurityContext.HTML, userHtml);",
    },
    {
        "name": "no-angular-innerhtml-binding",
        "id": "R029",
        "scope": "Angular template bindings that write raw HTML using `[innerHTML]`.",
        "report": "Template fragments containing `[innerHTML]=...` bindings.",
        "why": "Raw HTML bindings are high-risk unless source content is tightly sanitized and policy-reviewed.",
        "bad": 'const template = `<div [innerHTML]="userHtml"></div>`;',
        "good": "const template = `<div>{{ safeText }}</div>`;",
    },
    {
        "name": "no-angularjs-ng-bind-html-without-sanitize",
        "id": "R030",
        "scope": "AngularJS templates using `ng-bind-html` without explicit sanitize context.",
        "report": "`ng-bind-html` usage in template strings that do not indicate sanitize support.",
        "why": "Unsafe HTML binding in AngularJS can lead to reflected or stored XSS.",
        "bad": 'const template = `<div ng-bind-html="unsafeHtml"></div>`;',
        "good": 'const template = `<div ng-bind-html="trustedHtml" ngSanitize></div>`;',
    },
    {
        "name": "no-angularjs-sce-resource-url-wildcard",
        "id": "R031",
        "scope": "AngularJS SCE whitelist configurations using wildcard entries.",
        "report": "`resourceUrlWhitelist([...])` entries that contain wildcard values.",
        "why": "Wildcard resource URL allowlists can over-trust unreviewed remote origins.",
        "bad": '$sceDelegateProvider.resourceUrlWhitelist(["self", "*"]);',
        "good": '$sceDelegateProvider.resourceUrlWhitelist(["self", "https://cdn.example.com/app"]);',
    },
    {
        "name": "no-child-process-shell-true",
        "id": "R032",
        "scope": "Node child_process execution options that enable `shell: true`.",
        "report": "`spawn(...)` / `execFile(...)` options objects with `shell: true`.",
        "why": "Shell execution expands injection risk when command fragments include user-influenced input.",
        "bad": 'spawn("cmd", ["/c", command], { shell: true });',
        "good": 'spawn("node", ["script.js"], { shell: false });',
    },
    {
        "name": "no-domparser-html-without-sanitization",
        "id": "R033",
        "scope": '`DOMParser.parseFromString(..., "text/html")` on unsanitized input.',
        "report": "HTML parsing calls where the source value is not sanitized by an explicit policy function.",
        "why": "Parsing unsanitized HTML creates unsafe document fragments and XSS surfaces.",
        "bad": 'new DOMParser().parseFromString(userHtml, "text/html");',
        "good": 'new DOMParser().parseFromString(sanitize(userHtml), "text/html");',
    },
    {
        "name": "no-electron-insecure-certificate-verify-proc",
        "id": "R034",
        "scope": "Electron `session.setCertificateVerifyProc` handlers that trust invalid certificates.",
        "report": "Verify-proc handlers that `callback(0)` or return `0`.",
        "why": "Overriding certificate checks can silently disable TLS trust guarantees.",
        "bad": 'session.defaultSession.setCertificateVerifyProc((request, callback) => { callback(0); });',
        "good": 'session.defaultSession.setCertificateVerifyProc((request, callback) => { callback(-3); });',
    },
    {
        "name": "no-electron-insecure-permission-request-handler",
        "id": "R035",
        "scope": "Electron permission handlers that blanket-allow permission requests.",
        "report": "`setPermissionRequestHandler` callbacks that unconditionally `callback(true)` or return `true`.",
        "why": "Blindly granting permissions can expose camera, microphone, clipboard, and notification abuse vectors.",
        "bad": 'session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => { callback(true); });',
        "good": 'session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => { callback(permission === "notifications"); });',
    },
    {
        "name": "no-electron-unchecked-ipc-sender",
        "id": "R036",
        "scope": "`ipcMain.on`/`ipcMain.handle` callbacks without sender/frame trust validation.",
        "report": "Privileged IPC handlers that process requests without checking sender origin/frame trust.",
        "why": "Unvalidated IPC senders can let compromised renderers invoke privileged main-process operations.",
        "bad": 'ipcMain.handle("read-file", async (event) => readFile("secret.txt"));',
        "good": 'ipcMain.handle("read-file", async (event) => { if (!event.senderFrame?.url?.startsWith("https://example.com")) return null; return "ok"; });',
    },
    {
        "name": "no-electron-unrestricted-navigation",
        "id": "R037",
        "scope": "Electron navigation/open handlers that allow unrestricted navigation behavior.",
        "report": "`setWindowOpenHandler` returning allow, or `will-navigate` handlers that do not block by default.",
        "why": "Unrestricted navigation can enable tabnabbing, phishing surfaces, and privilege-boundary bypasses.",
        "bad": 'contents.setWindowOpenHandler(() => ({ action: "allow" }));',
        "good": 'contents.on("will-navigate", (event, url) => { event.preventDefault(); if (url === "https://example.com") { /* reviewed allowlist path */ } });',
    },
    {
        "name": "no-electron-webview-allowpopups",
        "id": "R038",
        "scope": "Electron `<webview>` usage with `allowpopups` enabled.",
        "report": "JSX `<webview>` attributes that enable `allowpopups`.",
        "why": "Allowing popups from embedded untrusted content expands attack surface and abuse channels.",
        "bad": 'const view = <webview allowpopups src="https://example.com" />;',
        "good": 'const view = <webview src="https://example.com" />;',
    },
    {
        "name": "no-electron-webview-node-integration",
        "id": "R039",
        "scope": "Electron `<webview>` configurations enabling node integration flags.",
        "report": "`webview` `nodeintegration`/`nodeintegrationinsubframes`/`webpreferences` node-integration flags.",
        "why": "Node integration in untrusted renderer contexts can break isolation and enable code-execution paths.",
        "bad": 'const view = <webview nodeintegration src="https://example.com" />;',
        "good": 'const view = <webview src="https://example.com" webpreferences="sandbox=yes" />;',
    },
    {
        "name": "no-http-request-to-insecure-protocol",
        "id": "R040",
        "scope": "Network client calls to insecure `http://` endpoints.",
        "report": "`http`/`https`/`fetch` calls whose URL literal starts with `http://`.",
        "why": "Unencrypted HTTP can expose credentials, tokens, and payload integrity to active network attackers.",
        "bad": 'http.get("http://api.example.com/status");',
        "good": 'https.get("https://api.example.com/status");',
    },
    {
        "name": "no-insecure-tls-agent-options",
        "id": "R041",
        "scope": "TLS/HTTPS options objects that disable certificate verification.",
        "report": "`rejectUnauthorized: false` in option objects.",
        "why": "Disabling certificate verification removes core TLS trust guarantees.",
        "bad": 'new https.Agent({ rejectUnauthorized: false });',
        "good": 'new https.Agent({ rejectUnauthorized: true });',
    },
    {
        "name": "no-location-javascript-url",
        "id": "R042",
        "scope": "Location/open navigation sinks assigned `javascript:` URLs.",
        "report": "Assignments and calls that pass `javascript:` URL strings into navigation sinks.",
        "why": "`javascript:` URL execution is a classic DOM XSS sink and should be blocked in modern code.",
        "bad": 'window.location.href = "javascript:alert(1)";',
        "good": 'window.location.href = "https://example.com";',
    },
    {
        "name": "no-nonnull-assertion-on-security-input",
        "id": "R043",
        "scope": "TypeScript non-null assertions on security-sensitive input values.",
        "report": "TS non-null assertions on identifiers/properties with security-sensitive names.",
        "why": "Non-null assertions can hide validation gaps and bypass defensive checks on attacker-controlled input.",
        "bad": "const safe = userInput!;",
        "good": "const safe = validateInput(userInput);",
    },
    {
        "name": "no-postmessage-without-origin-allowlist",
        "id": "R044",
        "scope": "`postMessage` calls without strict explicit target-origin allowlists.",
        "report": "`postMessage` targetOrigin values that are wildcard or non-literal/dynamic.",
        "why": "Weak targetOrigin control can expose cross-origin data or command channels to malicious frames.",
        "bad": 'target.postMessage(data, "*");',
        "good": 'target.postMessage(data, "https://example.com");',
    },
    {
        "name": "no-unsafe-cast-to-trusted-types",
        "id": "R045",
        "scope": "Type assertions/casts to Trusted Types without trusted factory creation.",
        "report": "Unsafe casts/as-assertions to `TrustedHTML`/`TrustedScript`/`TrustedScriptURL`.",
        "why": "Type-only casts do not sanitize data and can bypass Trusted Types enforcement intent.",
        "bad": "const trusted = userHtml as TrustedHTML;",
        "good": "const trusted = policy.createHTML(userHtml) as TrustedHTML;",
    },
]

ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs" / "rules"

for doc in DOCS:
    content = (
        f"# {doc['name']}\n\n"
        f"> **Rule catalog ID:** {doc['id']}\n\n"
        "## Targeted pattern scope\n\n"
        f"{doc['scope']}\n\n"
        "## What this rule reports\n\n"
        f"{doc['report']}\n\n"
        "## Why this rule exists\n\n"
        f"{doc['why']}\n\n"
        "## ❌ Incorrect\n\n"
        "```ts\n"
        f"{doc['bad']}\n"
        "```\n\n"
        "## ✅ Correct\n\n"
        "```ts\n"
        f"{doc['good']}\n"
        "```\n\n"
        "## Further reading\n\n"
        "- [OWASP Top 10: Injection](https://owasp.org/www-project-top-ten/)\n"
        "- [OWASP Top 10: Security Misconfiguration](https://owasp.org/www-project-top-ten/)\n"
    )
    path = DOCS_DIR / f"{doc['name']}.md"
    path.write_text(content.replace("\n", "\r\n"), encoding="utf-8")

print(f"rewrote {len(DOCS)} docs")
