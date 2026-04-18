/**
 * Rules-coverage-3.test.ts
 *
 * Targeted coverage tests for ESLint SDL rules — Phase 3. Covers early-return
 * guards, fixer edge cases, bracket-notation method names, SpreadElement in
 * options objects, and other uncovered code paths.
 */

import { createRuleTester, getPluginRule } from "./_internal/ruleTester.js";
import { tsReactLanguageOptions } from "./_internal/test-utils.js";

const ruleTester = createRuleTester();

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-dangerous-blink-features
// Uncovered: line 35 (continue for SpreadElement), line 55 (return undefined in getStaticStringValue),
//            line 62 (return false in isDangerousBlinkFeaturesValue),
//            line 78 (return when firstArgument is not ObjectExpression),
//            line 87 (return when no webPreferences ObjectExpression)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-dangerous-blink-features",
    getPluginRule("no-electron-dangerous-blink-features"),
    {
        invalid: [
            // Covers line 35: SpreadElement before enableBlinkFeatures in webPreferences
            {
                code: "new BrowserWindow({ webPreferences: { ...basePrefs, enableBlinkFeatures: 'SomeFeature' } });",
                errors: [{ messageId: "default" }],
            },
            // Covers basic invalid case (verify rule works)
            {
                code: "new BrowserWindow({ webPreferences: { enableBlinkFeatures: 'AllowContentInitiatedDataUrlNavigations' } });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 78: firstArgument is Identifier (not ObjectExpression)
            "new BrowserWindow(webPrefsObj);",
            // Covers line 87: no webPreferences property at all
            "new BrowserWindow({ contextIsolation: true });",
            // Covers line 87: webPreferences is Identifier (not ObjectExpression)
            "new BrowserWindow({ webPreferences: webPrefsVar });",
            // Covers lines 55/62: enableBlinkFeatures is a variable reference (not static string)
            "new BrowserWindow({ webPreferences: { enableBlinkFeatures: featureList } });",
            // Empty string is safe (non-dangerous blink features value)
            "new BrowserWindow({ webPreferences: { enableBlinkFeatures: '' } });",
            // Template literal with expressions (not static)
            `new BrowserWindow({ webPreferences: { enableBlinkFeatures: \`\${featureVar}\` } });`,
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-angular-innerhtml-binding — Literal invalid path (line 26)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-angular-innerhtml-binding",
    getPluginRule("no-angular-innerhtml-binding"),
    {
        invalid: [
            // Covers line 26: string Literal containing [innerHTML] binding → reports
            {
                code: "const s = '[innerHTML]=value';",
                errors: [{ messageId: "default" }],
            },
            // Another Literal match
            {
                code: "const attr = '[innerHTML]=\" + someVar';",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 43: TemplateLiteral without [innerHTML] binding → return early
            "const t = `no-innerhtml-binding here`;",
            // Non-matching string
            "const s = 'normal string without binding';",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-unrestricted-navigation — additional paths
// Uncovered: line 86 (setWindowOpenHandler with non-function arg),
//            line ~101/114 (methodName not "on"), line ~107/121 (event != will-navigate),
//            line ~113/127 (preventDefault present)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-unrestricted-navigation",
    getPluginRule("no-electron-unrestricted-navigation"),
    {
        invalid: [
            // Invalid: setWindowOpenHandler that allows
            {
                code: "win.setWindowOpenHandler(() => ({ action: 'allow' }));",
                errors: [{ messageId: "default" }],
            },
            // Invalid: will-navigate without preventDefault
            {
                code: "win.on('will-navigate', (event) => { handleNavigation(); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 86: setWindowOpenHandler with Identifier argument (not function)
            "win.setWindowOpenHandler(handler);",
            // Covers line 86: setWindowOpenHandler with no arguments
            "win.setWindowOpenHandler();",
            // Covers line ~114: method is 'off' (not 'on' and not 'setWindowOpenHandler') → return
            "win.off('will-navigate', fn);",
            // Covers line ~121: on() but event is not 'will-navigate' → return
            "win.on('navigation-event', fn);",
            // Covers line ~127: on('will-navigate') but handler calls event.preventDefault()
            "win.on('will-navigate', (event) => { event.preventDefault(); });",
            // Valid deny action
            "win.setWindowOpenHandler(() => ({ action: 'deny' }));",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-untrusted-open-external — additional paths
// Uncovered: line 61 (CallExpression object → not Identifier/MemberExpression),
//            line 71 (callee not MemberExpression), line 75 (not openExternal),
//            line 87 (!isShellOpenExternalCallee → early return), line 96 (allowed protocol)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-untrusted-open-external",
    getPluginRule("no-electron-untrusted-open-external"),
    {
        invalid: [
            // Invalid: insecure HTTP URL
            {
                code: "shell.openExternal('http://insecure.example.com');",
                errors: [{ messageId: "default" }],
            },
            // Invalid: variable URL (unknown protocol)
            {
                code: "shell.openExternal(userProvidedUrl);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 61: object is CallExpression → isShellObjectExpression returns false
            "getShell().openExternal(url);",
            // Covers line 71: callee is Identifier (not MemberExpression) → isShellOpenExternalCallee returns false
            "openExternal(url);",
            // Covers line 75: method is not 'openExternal' → isShellOpenExternalCallee returns false
            "shell.close();",
            // Covers line 87: object is not shell-like → no report
            "fs.readFile('path');",
            // Covers line 96: allowed https:// protocol → early return (no report)
            "shell.openExternal('https://safe.example.com');",
            // Covers line 96: allowed mailto: protocol
            "shell.openExternal('mailto:user@example.com');",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-expose-raw-ipc-renderer — additional paths
// Uncovered: lines 20-24 (MemberExpression contextBridge path),
//            line 21 (non-Identifier/non-MemberExpression returns false),
//            line 29 (callee not MemberExpression), line 58 (object's object is CallExpression),
//            line 75 (bind check falls through with non-ipcRenderer)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-expose-raw-ipc-renderer",
    getPluginRule("no-electron-expose-raw-ipc-renderer"),
    {
        invalid: [
            // Covers lines 20-24: electron.contextBridge.exposeInMainWorld (callee.object is MemberExpression)
            {
                code: "electron.contextBridge.exposeInMainWorld('api', ipcRenderer);",
                errors: [{ messageId: "default" }],
            },
            // Covers the exposeInIsolatedWorld path (2-arg: worldId, bindings)
            {
                code: "contextBridge.exposeInIsolatedWorld(1, ipcRenderer);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 21: callee.object is CallExpression (not Identifier/MemberExpression)
            "getContextBridge().exposeInMainWorld('api', ipcRenderer);",
            // Covers line 29: callee itself is not MemberExpression (bare function call)
            "exposeInMainWorld('api', ipcRenderer);",
            // Covers line 58: exposed value is MemberExpression where object is CallExpression
            "contextBridge.exposeInMainWorld('api', getModule().send);",
            // Covers line 75: bind() call with non-ipcRenderer method (falls through if block)
            "contextBridge.exposeInMainWorld('api', nonIpc.method.bind(null));",
            // SpreadElement with non-ipcRenderer object
            "contextBridge.exposeInMainWorld('api', { ...safeApi });",
            // Safe exposure
            "contextBridge.exposeInMainWorld('api', { send: (ch, data) => ipcRenderer.send(ch, data) });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-unchecked-ipc-sender — additional paths
// Uncovered: lines 37-38 (not Identifier/not MemberExpression → returns false),
//            line 41 (getMemberPropertyName for MemberExpression callee.object === "ipcMain"),
//            line 107 (first param is not Identifier), line 113 (sender validation present)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-unchecked-ipc-sender",
    getPluginRule("no-electron-unchecked-ipc-sender"),
    {
        invalid: [
            // Covers line 41: electron.ipcMain.on (callee.object is MemberExpression with "ipcMain" property)
            {
                code: "electron.ipcMain.on('msg', (event) => { doSomething(event); });",
                errors: [{ messageId: "default" }],
            },
            // Covers FunctionExpression handler
            {
                code: "ipcMain.on('channel', function(event) { handleEvent(event); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers lines 37-38: callee.object is CallExpression → isIpcMainObjectExpression returns false
            "getIpcMain().on('msg', (event) => { doSomething(event); });",
            // Covers line 107: first param is destructured (ObjectPattern) → return
            "ipcMain.on('msg', ({ data }) => { doSomething(data); });",
            // Covers line 107: no params at all → first param is undefined → return
            "ipcMain.on('msg', () => { doSomething(); });",
            // Covers line 113: handler validates event.sender → return (safe)
            "ipcMain.on('msg', (event) => { const url = event.sender.getURL(); doSomething(url); });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-child-process-shell-true — many uncovered paths
// Uncovered: lines 18-25 (getMemberPropertyName Literal branch),
//            line 38 (continue for SpreadElement in options),
//            line 50 (continue for non-shell key), line 67 (return false for non-Identifier/MemberExpression callee)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-child-process-shell-true",
    getPluginRule("no-child-process-shell-true"),
    {
        invalid: [
            // Covers lines 18-22: getMemberPropertyName Literal branch (bracket notation for method name)
            {
                code: "cp['spawn']('cmd', ['arg'], { shell: true });",
                errors: [{ messageId: "default" }],
            },
            // Covers line 38: SpreadElement in options object → continue, then finds shell
            {
                code: "spawn('cmd', [], { ...baseOpts, shell: true });",
                errors: [{ messageId: "default" }],
            },
            // Covers line 50: non-shell key before shell → continue, then finds shell
            {
                code: "spawn('cmd', [], { timeout: 5000, shell: true });",
                errors: [{ messageId: "default" }],
            },
            // Covers string literal key in options
            {
                code: "spawn('cmd', [], { 'shell': true });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 67: callee is CallExpression (IIFE-style) → isTargetChildProcessMethod returns false
            "getSpawn()('cmd', [], { shell: true });",
            // Covers line 25: getMemberPropertyName returns undefined (computed variable key)
            "cp[method]('cmd', [], { shell: true });",
            // Safe: shell is false
            "spawn('cmd', [], { shell: false });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-insecure-tls-agent-options — additional paths
// Uncovered: line 15 (return undefined for computed key), lines 22-27 (Literal string key),
//            line 29 (return undefined for non-string Literal), line 37 (continue for SpreadElement),
//            line 41 (continue for non-rejectUnauthorized key)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-insecure-tls-agent-options",
    getPluginRule("no-insecure-tls-agent-options"),
    {
        invalid: [
            // Covers lines 22-27: string Literal key notation for 'rejectUnauthorized'
            {
                code: "const opts = { 'rejectUnauthorized': false };",
                errors: [{ messageId: "default" }],
                output: "const opts = { 'rejectUnauthorized': true };",
            },
            // Covers line 37: SpreadElement in options → continue, then finds rejectUnauthorized
            {
                code: "const opts = { ...baseOpts, rejectUnauthorized: false };",
                errors: [{ messageId: "default" }],
                output: "const opts = { ...baseOpts, rejectUnauthorized: true };",
            },
            // Covers line 41: non-rejectUnauthorized key first → continue
            {
                code: "const opts = { timeout: 5000, rejectUnauthorized: false };",
                errors: [{ messageId: "default" }],
                output: "const opts = { timeout: 5000, rejectUnauthorized: true };",
            },
            // Covers line 15: computed key first → getObjectPropertyName returns undefined at line 15
            {
                code: "const opts = { [key]: false, rejectUnauthorized: false };",
                errors: [{ messageId: "default" }],
                output: "const opts = { [key]: false, rejectUnauthorized: true };",
            },
            // Covers line 29: non-string Literal key (numeric) → return undefined at line 29
            {
                code: "const opts = { 42: false, rejectUnauthorized: false };",
                errors: [{ messageId: "default" }],
                output: "const opts = { 42: false, rejectUnauthorized: true };",
            },
        ],
        valid: [
            "const opts = { rejectUnauthorized: true };",
            "const opts = {};",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-insecure-certificate-verify-proc — additional paths
// Uncovered: lines 20-27 (Literal bracket notation), line 72 (wrong method name), line 82 (non-function arg)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-insecure-certificate-verify-proc",
    getPluginRule("no-electron-insecure-certificate-verify-proc"),
    {
        invalid: [
            // Standard invalid
            {
                code: "session.setCertificateVerifyProc((req, callback) => { callback(0); });",
                errors: [{ messageId: "default" }],
            },
            // Covers lines 20-27: bracket notation (Literal string property name)
            {
                code: "session['setCertificateVerifyProc']((req, callback) => { callback(0); });",
                errors: [{ messageId: "default" }],
            },
            // Covers return 0 pattern
            {
                code: "session.setCertificateVerifyProc((req) => { return 0; });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 72: different method name → getMemberPropertyName returns "other" → early return
            "session.setOtherHandler(fn);",
            // Covers line 82: first argument is Identifier (not function expression)
            "session.setCertificateVerifyProc(verifyHandler);",
            // Covers line ~88: last param is ObjectPattern (not Identifier)
            "session.setCertificateVerifyProc(({ hostname }) => { hostname && callback(1); });",
            // Safe handler
            "session.setCertificateVerifyProc((req, callback) => { callback(1); });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-insecure-permission-request-handler — additional paths
// Same structure as certificate-verify-proc
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-insecure-permission-request-handler",
    getPluginRule("no-electron-insecure-permission-request-handler"),
    {
        invalid: [
            // Standard invalid
            {
                code: "session.setPermissionRequestHandler((wc, perm, callback) => { callback(true); });",
                errors: [{ messageId: "default" }],
            },
            // Covers lines 20-27: bracket notation
            {
                code: "session['setPermissionRequestHandler']((wc, perm, callback) => { callback(true); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 72: different method name → early return
            "session.setOtherHandler(fn);",
            // Covers line 82: first argument is Identifier
            "session.setPermissionRequestHandler(permissionHandler);",
            // Covers line ~88: last param is ObjectPattern
            "session.setPermissionRequestHandler(({ permission }) => { return false; });",
            // Safe handler
            "session.setPermissionRequestHandler((wc, perm, callback) => { callback(false); });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-node-integration — fixer edge case (line 25: comment before true value)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-node-integration",
    getPluginRule("no-electron-node-integration"),
    {
        invalid: [
            // Standard fixer case (covers the main fixer path)
            {
                code: "new BrowserWindow({ webPreferences: { nodeIntegration: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { nodeIntegration: false } });",
            },
            // nodeIntegrationInWorker
            {
                code: "new BrowserWindow({ webPreferences: { nodeIntegrationInWorker: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { nodeIntegrationInWorker: false } });",
            },
            // nodeIntegrationInSubFrames
            {
                code: "new BrowserWindow({ webPreferences: { nodeIntegrationInSubFrames: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { nodeIntegrationInSubFrames: false } });",
            },
            // Covers line 25: comment before 'true' → trimmedValuePortion starts with "/* comment */" → fixer returns null
            {
                code: "new BrowserWindow({ webPreferences: { nodeIntegration: /* enabled */ true } });",
                errors: [{ messageId: "default" }],
                // Fixer returns null (can't safely fix when there's a comment before the value)
                output: null,
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { nodeIntegration: false } });",
            "new BrowserWindow({ webPreferences: { contextIsolation: true } });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-node-tls-reject-unauthorized-zero — additional paths
// Uncovered: line 27 (getMemberPropertyName returns undefined), line 32 (Literal bracket path),
//            line 36 (!isProcessEnvAccess → early return), line 74 (TemplateLiteral suggestion)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-node-tls-reject-unauthorized-zero",
    getPluginRule("no-node-tls-reject-unauthorized-zero"),
    {
        invalid: [
            // Covers line 74: TemplateLiteral `0` with suggestion output `1`
            {
                code: "process.env.NODE_TLS_REJECT_UNAUTHORIZED = `0`;",
                errors: [
                    {
                        messageId: "default",
                        suggestions: [
                            {
                                messageId:
                                    "replaceWithTlsRejectUnauthorizedOne",
                                output: "process.env.NODE_TLS_REJECT_UNAUTHORIZED = `1`;",
                            },
                        ],
                    },
                ],
            },
            // Covers line 32: bracket notation (Literal string property name)
            {
                code: "process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';",
                errors: [
                    {
                        messageId: "default",
                        suggestions: [
                            {
                                messageId:
                                    "replaceWithTlsRejectUnauthorizedOne",
                                output: "process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';",
                            },
                        ],
                    },
                ],
            },
            // Covers numeric 0 case
            {
                code: "process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;",
                errors: [
                    {
                        messageId: "default",
                        suggestions: [
                            {
                                messageId:
                                    "replaceWithTlsRejectUnauthorizedOne",
                                output: "process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';",
                            },
                        ],
                    },
                ],
            },
        ],
        valid: [
            // Covers line 36: getProcess() is CallExpression → !isProcessEnvAccess → early return
            "getProcess().env.NODE_TLS_REJECT_UNAUTHORIZED = '0';",
            // Covers line 27: getMemberPropertyName returns undefined (computed key)
            "process.env[dynKey] = '0';",
            // Safe value
            "process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-unsafe-alloc — allocUnsafeSlow fixer path
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-unsafe-alloc", getPluginRule("no-unsafe-alloc"), {
    invalid: [
        // Fixer replaces allocUnsafe with alloc
        {
            code: "Buffer.allocUnsafe(1024);",
            errors: [{ messageId: "default" }],
            output: "Buffer.alloc(1024);",
        },
        // Covers allocUnsafeSlow (fixer replaces with alloc)
        {
            code: "Buffer.allocUnsafeSlow(512);",
            errors: [{ messageId: "default" }],
            output: "Buffer.alloc(512);",
        },
    ],
    valid: [
        // Size 0 is exempt
        "Buffer.allocUnsafe(0);",
        "Buffer.allocUnsafeSlow(0);",
        // Regular alloc is fine
        "Buffer.alloc(1024);",
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-iframe-srcdoc — additional paths
// Uncovered: line 129 (CallExpression with non-MemberExpression callee),
//            line 156 (!isLikelyIFrameElement returns false for non-iframe object),
//            line 166 (JSXOpeningElement with non-iframe element),
//            line 176 (JSX attribute not srcdoc)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-iframe-srcdoc", getPluginRule("no-iframe-srcdoc"), {
    invalid: [
        // Standard invalid: AssignmentExpression with iframe-like variable ('myiframe' ends with 'iframe')
        {
            code: "myIframe.srcdoc = '<html><body>test</body></html>';",
            errors: [{ messageId: "default" }],
        },
        // Standard invalid: setAttribute with srcdoc
        {
            code: "iframe.setAttribute('srcdoc', '<html>content</html>');",
            errors: [{ messageId: "default" }],
        },
        // JSX: iframe with srcdoc attribute
        {
            code: "<iframe srcdoc='<html>content</html>' />;",
            errors: [{ messageId: "default" }],
            languageOptions: tsReactLanguageOptions,
        },
    ],
    valid: [
        // Covers line 129: bare setAttribute call (callee not MemberExpression)
        "setAttribute('srcdoc', 'content');",
        // Covers line ~156: non-iframe object with setAttribute('srcdoc', ...)
        "div.setAttribute('srcdoc', '<html>content</html>');",
        // Covers AssignmentExpression non-iframe valid case
        "div.srcdoc = 'content';",
        // Covers AssignmentExpression with empty string (early return)
        "iframeEl.srcdoc = '';",
        // Covers setAttribute with empty second arg
        "iframe.setAttribute('srcdoc', '');",
        // Covers setAttribute with non-srcdoc attribute
        "iframe.setAttribute('class', 'frame');",
        // Covers JSX non-iframe element with srcdoc
        {
            code: String.raw`<div srcdoc='content' />;`,
            languageOptions: tsReactLanguageOptions,
        },
        // Covers JSX iframe without srcdoc attribute
        {
            code: String.raw`<iframe className="frame" />;`,
            languageOptions: tsReactLanguageOptions,
        },
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-inner-html — additional paths
// Uncovered: line 40 (empty string early return), line 56 (mightBeHTMLElement = false with type checker)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-inner-html", getPluginRule("no-inner-html"), {
    invalid: [
        // Standard invalid: innerHTML assignment
        {
            code: "element.innerHTML = '<b>Bold text</b>';",
            errors: [{ messageId: "noInnerHtml" }],
        },
        // OuterHTML
        {
            code: "element.outerHTML = '<div>content</div>';",
            errors: [{ messageId: "noInnerHtml" }],
        },
        // InsertAdjacentHTML
        {
            code: "element.insertAdjacentHTML('beforeend', '<p>text</p>');",
            errors: [{ messageId: "noInsertAdjacentHTML" }],
        },
    ],
    valid: [
        // Covers line 40: empty string → isEmptyStringLiteral → early return
        "element.innerHTML = '';",
        // Covers outerHTML with empty string
        "element.outerHTML = '';",
        // Non-innerHTML assignment
        "element.textContent = 'safe text';",
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-node-vm-run-in-context — additional patterns
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-node-vm-run-in-context",
    getPluginRule("no-node-vm-run-in-context"),
    {
        invalid: [
            // ESM named import of vm functions
            {
                code: "import { Script } from 'vm'; new Script('eval code');",
                errors: [{ messageId: "default" }],
            },
            // Namespace/default import
            {
                code: "import vm from 'vm'; new vm.Script('eval code');",
                errors: [{ messageId: "default" }],
            },
            // Inline require NewExpression
            {
                code: "new (require('vm')).Script('eval code');",
                errors: [{ messageId: "default" }],
            },
            // AssignmentPattern in destructuring
            {
                code: "const { Script: VmScript = Fallback } = require('vm'); new VmScript('code');",
                errors: [{ messageId: "default" }],
            },
            // Namespace require + method call
            {
                code: "const vm = require('vm'); vm.runInContext('code', ctx);",
                errors: [{ messageId: "default" }],
            },
            // Destructured require
            {
                code: "const { runInNewContext } = require('vm'); runInNewContext('code', {});",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "const s = new (require('path')).resolve('code');",
            "const fs = require('fs'); fs.readFile('file');",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-node-vm-source-text-module — additional patterns
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-node-vm-source-text-module",
    getPluginRule("no-node-vm-source-text-module"),
    {
        invalid: [
            // ESM named import
            {
                code: "import { SourceTextModule } from 'vm'; new SourceTextModule('code');",
                errors: [{ messageId: "default" }],
            },
            // Namespace default import
            {
                code: "import vm from 'vm'; new vm.SourceTextModule('module code');",
                errors: [{ messageId: "default" }],
            },
            // Inline require NewExpression
            {
                code: "new (require('vm')).SourceTextModule('module code');",
                errors: [{ messageId: "default" }],
            },
            // AssignmentPattern in destructuring
            {
                code: "const { SourceTextModule = Fallback } = require('vm'); new SourceTextModule('code');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "import { readFile } from 'fs'; readFile('file');",
            "const path = require('path'); path.join('/foo', 'bar');",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-node-worker-threads-eval — additional patterns
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-node-worker-threads-eval",
    getPluginRule("no-node-worker-threads-eval"),
    {
        invalid: [
            // ESM named import
            {
                code: "import { Worker } from 'worker_threads'; new Worker('x.js', { eval: true });",
                errors: [{ messageId: "default" }],
            },
            // Namespace default import
            {
                code: "import wt from 'worker_threads'; new wt.Worker('x.js', { eval: true });",
                errors: [{ messageId: "default" }],
            },
            // Inline require NewExpression
            {
                code: "new (require('worker_threads')).Worker('x.js', { eval: true });",
                errors: [{ messageId: "default" }],
            },
            // AssignmentPattern with rename
            {
                code: "const { Worker: MyWorker = Fallback } = require('worker_threads'); new MyWorker('x.js', { eval: true });",
                errors: [{ messageId: "default" }],
            },
            // Namespace require
            {
                code: "const wt = require('worker_threads'); new wt.Worker('x.js', { eval: true });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "import { Worker } from 'worker_threads'; new Worker('x.js');",
            "import { Worker } from 'worker_threads'; new Worker('x.js', { eval: false });",
            "import { Worker } from 'worker_threads'; new Worker('x.js', { workerData: {} });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-postmessage-star-origin — basic tests (without type checker)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-postmessage-star-origin",
    getPluginRule("no-postmessage-star-origin"),
    {
        invalid: [
            // Direct postMessage call with '*' origin
            {
                code: "window.postMessage(data, '*');",
                errors: [
                    {
                        messageId: "default",
                        suggestions: [
                            {
                                messageId: "replaceWithExplicitOrigin",
                                output: "window.postMessage(data, location.origin);",
                            },
                        ],
                    },
                ],
            },
            // Iframe.contentWindow.postMessage
            {
                code: "iframe.contentWindow.postMessage(data, '*');",
                errors: [
                    {
                        messageId: "default",
                        suggestions: [
                            {
                                messageId: "replaceWithExplicitOrigin",
                                output: "iframe.contentWindow.postMessage(data, location.origin);",
                            },
                        ],
                    },
                ],
            },
        ],
        valid: [
            "window.postMessage(data, 'https://example.com');",
            "postMessage(data, 'https://trusted.com');",
            // Bare postMessage() - rule only matches MemberExpression callee with .postMessage property
            "postMessage(data, '*');",
            "window.postMessage(data, location.origin);",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-window-open-without-noopener
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-window-open-without-noopener",
    getPluginRule("no-window-open-without-noopener"),
    {
        invalid: [
            {
                code: "window.open('https://example.com', '_blank');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "window.open('https://example.com', '_blank', 'noreferrer');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "window.open('https://example.com', '_blank', '');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "window.open('https://example.com', '_blank', 'noopener');",
            "window.open('https://example.com', '_blank', 'noopener,noreferrer');",
            "window.open('https://example.com', '_self');",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-worker-blob-url
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-worker-blob-url", getPluginRule("no-worker-blob-url"), {
    invalid: [
        {
            code: "const w = new Worker(URL.createObjectURL(blob));",
            errors: [{ messageId: "default" }],
        },
        {
            code: "const w = new SharedWorker(URL.createObjectURL(scriptBlob));",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "const w = new Worker('worker.js');",
        "const w = new Worker(workerUrl);",
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-worker-data-url — additional paths
// Uncovered: lines 20, 25, 45, 54
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-worker-data-url", getPluginRule("no-worker-data-url"), {
    invalid: [
        // Literal data: URL
        {
            code: "const w = new Worker('data:text/javascript,console.log(1)');",
            errors: [{ messageId: "default" }],
        },
        // TemplateLiteral data: URL (no expressions, so it's statically detectable)
        {
            code: "const w = new Worker(`data:text/javascript,alert(1)`);",
            errors: [{ messageId: "default" }],
        },
        // SharedWorker with data: URL
        {
            code: "const w = new SharedWorker('data:text/javascript,code');",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        // Regular file URL
        "const w = new Worker('worker.js');",
        // Template WITH expression (not static, can't determine URL) → not flagged
        `const w = new Worker(\`data:text/javascript,\${code}\`);`,
        // Template without data: prefix
        `const w = new Worker(\`\${baseUrl}/worker.js\`);`,
        // Blob URL (different rule handles this)
        "const w = new Worker(blobUrl);",
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-service-worker-unsafe-script-url
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-service-worker-unsafe-script-url",
    getPluginRule("no-service-worker-unsafe-script-url"),
    {
        invalid: [
            {
                code: "navigator.serviceWorker.register('javascript:alert(1)');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "navigator.serviceWorker.register('data:text/javascript,code');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "navigator.serviceWorker.register('/sw.js');",
            "navigator.serviceWorker.register('./service-worker.js');",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-winjs-html-unsafe
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-winjs-html-unsafe", getPluginRule("no-winjs-html-unsafe"), {
    invalid: [
        {
            code: "WinJS.Utilities.setInnerHTMLUnsafe(element, userHtml);",
            errors: [{ messageId: "default" }],
        },
        {
            code: "WinJS.Utilities.setOuterHTMLUnsafe(element, userHtml);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "WinJS.Utilities.setInnerHTML(element, safeHtml);",
        "element.innerHTML = safeHtml;",
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-angularjs-sanitization-whitelist — basic tests
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-angularjs-sanitization-whitelist",
    getPluginRule("no-angularjs-sanitization-whitelist"),
    {
        invalid: [
            {
                code: "$compileProvider.aHrefSanitizationWhitelist(/^https?:/);",
                errors: [{ messageId: "noSanitizationWhitelist" }],
            },
            {
                code: "$compileProvider.imgSrcSanitizationWhitelist(/^https?:/);",
                errors: [{ messageId: "noSanitizationWhitelist" }],
            },
        ],
        valid: [
            "$compileProvider.aHrefSanitizationTrustedUrlList(/^https?:/);",
            "$compileProvider.imgSrcSanitizationTrustedUrlList(/^https?:/);",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-insecure-certificate-error-handler
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-insecure-certificate-error-handler",
    getPluginRule("no-electron-insecure-certificate-error-handler"),
    {
        invalid: [
            {
                code: "app.on('certificate-error', (event, webContents, url, error, certificate, callback) => { callback(true); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "app.on('certificate-error', (event, webContents, url, error, certificate, callback) => { callback(false); });",
            "app.on('ready', () => { doSomething(); });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-electron-permission-check-handler-allow-all — additional paths
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-electron-permission-check-handler-allow-all",
    getPluginRule("no-electron-permission-check-handler-allow-all"),
    {
        invalid: [
            {
                code: "session.setPermissionCheckHandler((webContents, permission) => { return true; });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "session.setPermissionCheckHandler((webContents, permission) => { return permission === 'media'; });",
            "session.setPermissionCheckHandler((webContents, permission) => { return false; });",
            // Non-function argument → early return
            "session.setPermissionCheckHandler(permissionHandler);",
            // No args → early return
            "session.setPermissionCheckHandler();",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-set-html-unsafe
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-set-html-unsafe", getPluginRule("no-set-html-unsafe"), {
    invalid: [
        {
            code: "element.setHTMLUnsafe(userHtml);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "element.setHTML(sanitizedHtml);",
        "element.innerHTML = sanitizedHtml;",
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-document-parse-html-unsafe
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-document-parse-html-unsafe",
    getPluginRule("no-document-parse-html-unsafe"),
    {
        invalid: [
            // Capital D - static class method call
            {
                code: "Document.parseHTMLUnsafe(userHtml);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Lowercase document.parseHTMLUnsafe is NOT flagged (by rule design)
            "document.parseHTMLUnsafe(html);",
            "DOMParser.parseFromString(html, 'text/html');",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-dynamic-import-unsafe-url
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-dynamic-import-unsafe-url",
    getPluginRule("no-dynamic-import-unsafe-url"),
    {
        invalid: [
            {
                code: "import('javascript:alert(1)');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "import('data:text/javascript,code');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "import('./module.js');",
            `import(\`./modules/\${name}.js\`);`,
            "import('./safe-module.js')",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-node-tls-legacy-protocol — additional patterns
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-node-tls-legacy-protocol",
    getPluginRule("no-node-tls-legacy-protocol"),
    {
        invalid: [
            {
                code: "tls.connect({ minVersion: 'TLSv1' });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "tls.connect({ minVersion: 'TLSv1.1' });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "tls.connect({ maxVersion: 'TLSv1' });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "https.request({ host: 'example.com', maxVersion: 'TLSv1.1' });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "tls.connect({ minVersion: 'TLSv1.2' });",
            "tls.connect({ minVersion: 'TLSv1.3' });",
            "tls.connect({ host: 'example.com' });",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-document-write — basic tests
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-document-write", getPluginRule("no-document-write"), {
    invalid: [
        {
            code: "document.write('<p>content</p>');",
            errors: [{ messageId: "default" }],
        },
        {
            code: "document.writeln('<p>content</p>');",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["document.createElement('p');", "element.textContent = 'content';"],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-insecure-random — basic tests
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-insecure-random", getPluginRule("no-insecure-random"), {
    invalid: [
        {
            code: "const r = Math.random();",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "const r = crypto.getRandomValues(new Uint32Array(1));",
        "const buf = crypto.randomBytes(16);",
    ],
});

// ─────────────────────────────────────────────────────────────────────────────
// no-angular-bypass-security-trust-html — additional paths
// Uncovered: line 33 (callee not MemberExpression → early return)
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-angular-bypass-security-trust-html",
    getPluginRule("no-angular-bypass-security-trust-html"),
    {
        invalid: [
            // Standard invalid: sanitizer.bypassSecurityTrustHtml
            {
                code: "sanitizer.bypassSecurityTrustHtml(userHtml);",
                errors: [{ messageId: "default" }],
            },
            // Bracket notation - Literal branch
            {
                code: "sanitizer['bypassSecurityTrustHtml'](userHtml);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Covers line 33: callee is Identifier (not MemberExpression) → early return
            "bypassSecurityTrustHtml(html);",
            // Safe method
            "sanitizer.sanitize(html);",
        ],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-angular-bypass-sanitizer — basic tests
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run(
    "no-angular-bypass-sanitizer",
    getPluginRule("no-angular-bypass-sanitizer"),
    {
        invalid: [
            {
                code: "sanitizer.bypassSecurityTrustHtml(userHtml);",
                errors: [{ messageId: "noBypass" }],
            },
            // Dot-notation: bypassSecurityTrustScript (matches rule selector)
            {
                code: "sanitizer.bypassSecurityTrustScript(userScript);",
                errors: [{ messageId: "noBypass" }],
            },
        ],
        valid: ["sanitizer.sanitize(SecurityContext.HTML, html);"],
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// no-document-domain — basic tests
// ─────────────────────────────────────────────────────────────────────────────
ruleTester.run("no-document-domain", getPluginRule("no-document-domain"), {
    invalid: [
        {
            code: "document.domain = 'example.com';",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["document.title = 'My Page';", "element.domain = 'example.com';"],
});
