import { createRuleTester, getPluginRule } from "./_internal/ruleTester";
import {
    esModuleLanguageOptions,
    tsLanguageOptions,
    tsReactLanguageOptions,
} from "./_internal/test-utils";

const ruleTester = createRuleTester();

ruleTester.run(
    "no-angular-bypass-sanitizer",
    getPluginRule("no-angular-bypass-sanitizer"),
    {
        invalid: [
            {
                code: "$('p').bypassSecurityTrustHtml('XSS');",
                errors: [{ messageId: "noBypass" }],
            },
        ],
        valid: [
            "x.bypassSecurityTrustHtml()",
            "bypassSecurityTrustHtml('XSS')",
        ],
    }
);

ruleTester.run(
    "no-angular-bypass-security-trust-html",
    getPluginRule("no-angular-bypass-security-trust-html"),
    {
        invalid: [
            {
                code: "sanitizer.bypassSecurityTrustHtml(userHtml);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["sanitizer.sanitize(1, userHtml);"],
    }
);

ruleTester.run(
    "no-angular-innerhtml-binding",
    getPluginRule("no-angular-innerhtml-binding"),
    {
        invalid: [
            {
                code: 'const template = `<div [innerHTML]="userHtml"></div>`;',
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["const template = '<div>{{ value }}</div>';"],
    }
);

ruleTester.run(
    "no-angularjs-ng-bind-html-without-sanitize",
    getPluginRule("no-angularjs-ng-bind-html-without-sanitize"),
    {
        invalid: [
            {
                code: "const template = '<div ng-bind-html=\"unsafeHtml\"></div>';",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "const template = '<div ng-bind-html=\"trustedHtml\" ngSanitize></div>';",
        ],
    }
);

ruleTester.run(
    "no-angularjs-sce-resource-url-wildcard",
    getPluginRule("no-angularjs-sce-resource-url-wildcard"),
    {
        invalid: [
            {
                code: "$sceDelegateProvider.resourceUrlWhitelist(['self', '*']);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "$sceDelegateProvider.resourceUrlWhitelist(['self', 'https://cdn.example.com/app']);",
        ],
    }
);

ruleTester.run(
    "no-child-process-exec",
    getPluginRule("no-child-process-exec"),
    {
        invalid: [
            {
                code: "import { exec } from 'node:child_process'; exec('git status');",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "const { execSync } = require('child_process'); execSync('git status');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "import * as childProcess from 'node:child_process'; childProcess.exec('git status');",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "require('node:child_process').execSync('dir');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            {
                code: "import { execFile } from 'node:child_process'; execFile('node', ['script.js']);",
                languageOptions: tsLanguageOptions,
            },
            "const { execFileSync } = require('child_process'); execFileSync('node', ['script.js']);",
            {
                code: "import { exec } from './runner'; exec('build');",
                languageOptions: tsLanguageOptions,
            },
            "tool.exec('SELECT 1');",
        ],
    }
);

ruleTester.run(
    "no-child-process-shell-true",
    getPluginRule("no-child-process-shell-true"),
    {
        invalid: [
            {
                code: "spawn('cmd', ['/c', command], { shell: true });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["spawn('node', ['script.js'], { shell: false });"],
    }
);

ruleTester.run(
    "no-domparser-html-without-sanitization",
    getPluginRule("no-domparser-html-without-sanitization"),
    {
        invalid: [
            {
                code: "new DOMParser().parseFromString(userHtml, 'text/html');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "new DOMParser().parseFromString(sanitize(userHtml), 'text/html');",
        ],
    }
);

ruleTester.run(
    "no-domparser-svg-without-sanitization",
    getPluginRule("no-domparser-svg-without-sanitization"),
    {
        invalid: [
            {
                code: "new DOMParser().parseFromString(userSvg, 'image/svg+xml');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "new DOMParser().parseFromString(svgMarkup, `image/svg+xml`);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "new DOMParser().parseFromString(sanitize(userSvg), 'image/svg+xml');",
            "new DOMParser().parseFromString(userSvg, 'text/html');",
            "new DOMParser().parseFromString(userSvg, mimeType);",
        ],
    }
);

ruleTester.run(
    "no-dynamic-import-unsafe-url",
    getPluginRule("no-dynamic-import-unsafe-url"),
    {
        invalid: [
            {
                code: "const modulePromise = import('data:text/javascript,export default 1');",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "const modulePromise = import('blob:https://example.com/module');",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "const modulePromise = import(URL.createObjectURL(moduleBlob));",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "const modulePromise = import('javascript:export default 1');",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
        ],
        valid: [
            {
                code: "const modulePromise = import('./feature-module.js');",
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "const modulePromise = import(moduleSpecifier);",
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "URL.createObjectURL(moduleBlob);",
                languageOptions: esModuleLanguageOptions,
            },
        ],
    }
);

ruleTester.run(
    "no-document-parse-html-unsafe",
    getPluginRule("no-document-parse-html-unsafe"),
    {
        invalid: [
            {
                code: "Document.parseHTMLUnsafe(userHtml);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "window.Document.parseHTMLUnsafe(markup);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "Document.parseHTML(userHtml);",
            "Document.parseHTMLUnsafe('');",
            "parser.parseHTMLUnsafe(userHtml);",
        ],
    }
);

ruleTester.run(
    "no-document-execcommand-insert-html",
    getPluginRule("no-document-execcommand-insert-html"),
    {
        invalid: [
            {
                code: "document.execCommand('insertHTML', false, userHtml);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "window.document.execCommand(`insertHTML`, false, html);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "document.execCommand('copy');",
            "document.execCommand('insertHTML', false, '');",
            {
                code: "const doc = document; doc.execCommand('insertHTML', false, html);",
                languageOptions: tsLanguageOptions,
            },
            {
                code: "const documentLike = { execCommand() {} }; documentLike.execCommand('insertHTML', false, html);",
                languageOptions: tsLanguageOptions,
            },
        ],
    }
);

ruleTester.run("no-iframe-srcdoc", getPluginRule("no-iframe-srcdoc"), {
    invalid: [
        {
            code: "iframe.srcdoc = userHtml;",
            errors: [{ messageId: "default" }],
        },
        {
            code: "document.createElement('iframe').setAttribute('srcdoc', userHtml);",
            errors: [{ messageId: "default" }],
        },
        {
            code: "const frame = <iframe srcDoc={userHtml} />;",
            errors: [{ messageId: "default" }],
            languageOptions: tsReactLanguageOptions,
        },
    ],
    valid: [
        "iframe.srcdoc = '';",
        "document.createElement('iframe').setAttribute('src', 'https://example.com/embed');",
        {
            code: 'const frame = <iframe srcDoc="" />;',
            languageOptions: tsReactLanguageOptions,
        },
    ],
});

ruleTester.run(
    "no-script-src-data-url",
    getPluginRule("no-script-src-data-url"),
    {
        invalid: [
            {
                code: "document.createElement('script').src = 'data:text/javascript,alert(1)';",
                errors: [{ messageId: "default" }],
            },
            {
                code: "scriptElement.setAttribute('src', 'data:text/javascript;base64,ZXZpbA==');",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: 'const loader = <script src="data:text/javascript,bootstrap()" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
            },
        ],
        valid: [
            "document.createElement('script').src = 'https://cdn.example.com/app.js';",
            {
                code: "scriptElement.setAttribute('src', 'https://cdn.example.com/app.js');",
                languageOptions: tsLanguageOptions,
            },
            {
                code: 'const loader = <script src="https://cdn.example.com/app.js" />;',
                languageOptions: tsReactLanguageOptions,
            },
            {
                code: "const image = new Image(); image.src = 'data:image/png;base64,AAAA';",
                languageOptions: tsLanguageOptions,
            },
        ],
    }
);

ruleTester.run("no-worker-data-url", getPluginRule("no-worker-data-url"), {
    invalid: [
        {
            code: "new Worker('data:text/javascript,postMessage(1)');",
            errors: [{ messageId: "default" }],
        },
        {
            code: "new globalThis.SharedWorker('data:text/javascript,bootstrap()');",
            errors: [{ messageId: "default" }],
        },
        {
            code: "self.importScripts('https://cdn.example.com/a.js', 'data:text/javascript,bootstrap()');",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "new Worker('https://cdn.example.com/worker.js');",
        "importScripts('https://cdn.example.com/worker-helpers.js');",
        {
            code: "const workerUrl = 'data:text/javascript,postMessage(1)'; new Worker(workerUrl);",
            languageOptions: tsLanguageOptions,
        },
    ],
});

ruleTester.run("no-worker-blob-url", getPluginRule("no-worker-blob-url"), {
    invalid: [
        {
            code: "new Worker('blob:https://example.com/bootstrap');",
            errors: [{ messageId: "default" }],
        },
        {
            code: "new self.SharedWorker(URL.createObjectURL(workerBlob));",
            errors: [{ messageId: "default" }],
        },
        {
            code: "importScripts(URL.createObjectURL(new Blob(['bootstrap()'], { type: 'application/javascript' })));",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "new Worker('https://cdn.example.com/worker.js');",
        "importScripts('https://cdn.example.com/worker-helpers.js');",
        {
            code: "const workerUrl = 'blob:https://example.com/bootstrap'; new Worker(workerUrl);",
            languageOptions: tsLanguageOptions,
        },
        {
            code: "URL.createObjectURL(workerBlob);",
            languageOptions: tsLanguageOptions,
        },
    ],
});

ruleTester.run(
    "no-service-worker-unsafe-script-url",
    getPluginRule("no-service-worker-unsafe-script-url"),
    {
        invalid: [
            {
                code: "navigator.serviceWorker.register('data:text/javascript,bootstrap()');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "window.navigator.serviceWorker.register('blob:https://example.com/sw');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "globalThis.navigator.serviceWorker.register(URL.createObjectURL(workerBlob));",
                errors: [{ messageId: "default" }],
            },
            {
                code: "self.navigator.serviceWorker.register('javascript:bootstrap()');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "navigator.serviceWorker.register('/sw.js');",
            "navigator.serviceWorker.register(scriptUrl);",
            "serviceWorker.register('data:text/javascript,bootstrap()');",
        ],
    }
);

ruleTester.run(
    "no-electron-insecure-certificate-verify-proc",
    getPluginRule("no-electron-insecure-certificate-verify-proc"),
    {
        invalid: [
            {
                code: "session.defaultSession.setCertificateVerifyProc((request, callback) => { callback(0); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "session.defaultSession.setCertificateVerifyProc((request, callback) => { callback(-3); });",
        ],
    }
);

ruleTester.run(
    "no-electron-insecure-permission-request-handler",
    getPluginRule("no-electron-insecure-permission-request-handler"),
    {
        invalid: [
            {
                code: "session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => { callback(true); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => { callback(false); });",
        ],
    }
);

ruleTester.run(
    "no-electron-unchecked-ipc-sender",
    getPluginRule("no-electron-unchecked-ipc-sender"),
    {
        invalid: [
            {
                code: "ipcMain.handle('read-file', async (event) => readFile('secret.txt'));",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "ipcMain.handle('read-file', async (event) => { const url = event.senderFrame?.url; if (!url?.startsWith('https://example.com')) return null; return 'ok'; });",
        ],
    }
);

ruleTester.run(
    "no-electron-unrestricted-navigation",
    getPluginRule("no-electron-unrestricted-navigation"),
    {
        invalid: [
            {
                code: "contents.setWindowOpenHandler(() => ({ action: 'allow' }));",
                errors: [{ messageId: "default" }],
            },
            {
                code: "contents.on('will-navigate', (event, url) => { console.log(url); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "contents.on('will-navigate', (event, url) => { event.preventDefault(); if (url === 'https://example.com') { /* allow */ } });",
        ],
    }
);

ruleTester.run(
    "no-electron-webview-allowpopups",
    getPluginRule("no-electron-webview-allowpopups"),
    {
        invalid: [
            {
                code: 'const view = <webview allowpopups src="https://example.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: {
                            jsx: true,
                        },
                    },
                },
                output: 'const view = <webview  src="https://example.com" />;',
            },
        ],
        valid: [
            {
                code: 'const view = <webview src="https://example.com" />;',
                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: {
                            jsx: true,
                        },
                    },
                },
            },
        ],
    }
);

ruleTester.run(
    "no-electron-webview-node-integration",
    getPluginRule("no-electron-webview-node-integration"),
    {
        invalid: [
            {
                code: 'const view = <webview nodeintegration src="https://example.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: {
                            jsx: true,
                        },
                    },
                },
                output: 'const view = <webview  src="https://example.com" />;',
            },
        ],
        valid: [
            {
                code: 'const view = <webview src="https://example.com" webpreferences="sandbox=yes" />;',
                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: {
                            jsx: true,
                        },
                    },
                },
            },
        ],
    }
);

ruleTester.run(
    "no-electron-webview-insecure-webpreferences",
    getPluginRule("no-electron-webview-insecure-webpreferences"),
    {
        invalid: [
            {
                code: 'const view = <webview webpreferences="webSecurity=no, contextIsolation=no" src="https://example.com" />;',
                errors: [
                    {
                        data: {
                            flags: "contextIsolation, webSecurity",
                        },
                        messageId: "default",
                    },
                ],
                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: {
                            jsx: true,
                        },
                    },
                },
            },
        ],
        valid: [
            {
                code: 'const view = <webview webpreferences="sandbox=yes, contextIsolation=yes, webSecurity=yes" src="https://example.com" />;',
                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: {
                            jsx: true,
                        },
                    },
                },
            },
        ],
    }
);

ruleTester.run(
    "no-http-request-to-insecure-protocol",
    getPluginRule("no-http-request-to-insecure-protocol"),
    {
        invalid: [
            {
                code: "http.get('http://api.example.com/status');",
                errors: [{ messageId: "default" }],
                output: "http.get('https://api.example.com/status');",
            },
        ],
        valid: ["https.get('https://api.example.com/status');"],
    }
);

ruleTester.run(
    "no-insecure-tls-agent-options",
    getPluginRule("no-insecure-tls-agent-options"),
    {
        invalid: [
            {
                code: "new https.Agent({ rejectUnauthorized: false });",
                errors: [{ messageId: "default" }],
                output: "new https.Agent({ rejectUnauthorized: true });",
            },
        ],
        valid: ["new https.Agent({ rejectUnauthorized: true });"],
    }
);

ruleTester.run(
    "no-node-worker-threads-eval",
    getPluginRule("no-node-worker-threads-eval"),
    {
        invalid: [
            {
                code: "import { Worker } from 'node:worker_threads'; new Worker(userCode, { eval: true });",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "const { Worker } = require('worker_threads'); new Worker(sourceText, { eval: true });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "import * as workerThreads from 'node:worker_threads'; new workerThreads.Worker(sourceText, { eval: true });",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "new (require('node:worker_threads').Worker)(sourceText, { eval: true });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            {
                code: "import { Worker } from 'node:worker_threads'; new Worker(new URL('./worker.js', import.meta.url));",
                languageOptions: tsLanguageOptions,
            },
            {
                code: "import { Worker } from './worker-factory'; new Worker(sourceText, { eval: true });",
                languageOptions: tsLanguageOptions,
            },
            "const { Worker } = require('worker_threads'); new Worker(new URL('./worker.js', import.meta.url), { eval: false });",
            "new Worker(sourceText, { eval: true });",
        ],
    }
);

ruleTester.run(
    "no-node-vm-source-text-module",
    getPluginRule("no-node-vm-source-text-module"),
    {
        invalid: [
            {
                code: "import { SourceTextModule } from 'node:vm'; new SourceTextModule(sourceText);",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "const { SourceTextModule } = require('vm'); new SourceTextModule(sourceText);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "import vm from 'node:vm'; new vm.SourceTextModule(sourceText);",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "new (require('node:vm').SourceTextModule)(sourceText);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            {
                code: "import vm from 'node:vm'; vm.measureMemory();",
                languageOptions: tsLanguageOptions,
            },
            {
                code: "import { SourceTextModule } from './module-tools'; new SourceTextModule(sourceText);",
                languageOptions: tsLanguageOptions,
            },
            "tool.SourceTextModule(sourceText);",
            "new SourceTextModule(sourceText);",
        ],
    }
);

ruleTester.run(
    "no-node-vm-run-in-context",
    getPluginRule("no-node-vm-run-in-context"),
    {
        invalid: [
            {
                code: "import vm from 'node:vm'; vm.runInNewContext(userCode, sandbox);",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "const { runInThisContext } = require('vm'); runInThisContext(sourceText);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "import { Script } from 'node:vm'; new Script(sourceText);",
                errors: [{ messageId: "default" }],
                languageOptions: tsLanguageOptions,
            },
            {
                code: "require('node:vm').compileFunction(sourceText, []);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            {
                code: "import vm from 'node:vm'; vm.measureMemory();",
                languageOptions: tsLanguageOptions,
            },
            {
                code: "import { runInNewContext } from './sandbox'; runInNewContext(sourceText, sandbox);",
                languageOptions: tsLanguageOptions,
            },
            "tool.runInContext(sourceText);",
            "const { Script } = require('vm2'); new Script(sourceText);",
        ],
    }
);

ruleTester.run(
    "no-node-tls-legacy-protocol",
    getPluginRule("no-node-tls-legacy-protocol"),
    {
        invalid: [
            {
                code: "tls.createSecureContext({ minVersion: 'TLSv1.1' });",
                errors: [
                    {
                        data: {
                            configuredValue: "TLSv1.1",
                            propertyName: "minVersion",
                        },
                        messageId: "default",
                    },
                ],
            },
            {
                code: "new https.Agent({ secureProtocol: 'TLSv1_method' });",
                errors: [
                    {
                        data: {
                            configuredValue: "TLSv1_method",
                            propertyName: "secureProtocol",
                        },
                        messageId: "default",
                    },
                ],
            },
            {
                code: "tls.DEFAULT_MIN_VERSION = 'TLSv1';",
                errors: [
                    {
                        data: {
                            configuredValue: "TLSv1",
                            propertyName: "DEFAULT_MIN_VERSION",
                        },
                        messageId: "default",
                    },
                ],
            },
        ],
        valid: [
            "tls.createSecureContext({ minVersion: 'TLSv1.2' });",
            "new https.Agent({ secureProtocol: 'TLSv1_2_method' });",
            "http2.createSecureServer({ minVersion: 'TLSv1.2' });",
            "tls.DEFAULT_MIN_VERSION = 'TLSv1.2';",
            "request({ minVersion: 'TLSv1.1' });",
        ],
    }
);

ruleTester.run(
    "no-node-tls-check-server-identity-bypass",
    getPluginRule("no-node-tls-check-server-identity-bypass"),
    {
        invalid: [
            {
                code: "tls.connect({ checkServerIdentity: () => undefined });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "https.request({ checkServerIdentity() {} });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "tls.checkServerIdentity = () => null;",
                errors: [{ messageId: "default" }],
            },
            {
                code: "http2.connect(authority, { checkServerIdentity(hostname, cert) { return; } });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "tls.connect({ checkServerIdentity: tls.checkServerIdentity });",
            "https.request({ checkServerIdentity(hostname, cert) { return tls.checkServerIdentity(hostname, cert); } });",
            "request({ checkServerIdentity: () => undefined });",
            "tls.checkServerIdentity = (hostname, cert) => tls.checkServerIdentity(hostname, cert);",
        ],
    }
);

ruleTester.run(
    "no-node-tls-security-level-zero",
    getPluginRule("no-node-tls-security-level-zero"),
    {
        invalid: [
            {
                code: "tls.createSecureContext({ ciphers: 'DEFAULT@SECLEVEL=0' });",
                errors: [
                    {
                        data: {
                            configuredValue: "DEFAULT@SECLEVEL=0",
                            propertyName: "ciphers",
                        },
                        messageId: "default",
                    },
                ],
            },
            {
                code: "new https.Agent({ ciphers: 'DEFAULT:@SECLEVEL=0' });",
                errors: [
                    {
                        data: {
                            configuredValue: "DEFAULT:@SECLEVEL=0",
                            propertyName: "ciphers",
                        },
                        messageId: "default",
                    },
                ],
            },
            {
                code: "tls.DEFAULT_CIPHERS = 'DEFAULT@SECLEVEL=0';",
                errors: [
                    {
                        data: {
                            configuredValue: "DEFAULT@SECLEVEL=0",
                            propertyName: "DEFAULT_CIPHERS",
                        },
                        messageId: "default",
                    },
                ],
            },
        ],
        valid: [
            "tls.createSecureContext({ ciphers: 'DEFAULT' });",
            "http2.createSecureServer({ ciphers: 'DEFAULT:@SECLEVEL=1' });",
            "tls.DEFAULT_CIPHERS = 'DEFAULT';",
            "request({ ciphers: 'DEFAULT@SECLEVEL=0' });",
        ],
    }
);

ruleTester.run(
    "no-location-javascript-url",
    getPluginRule("no-location-javascript-url"),
    {
        invalid: [
            {
                code: "window.location.href = 'javascript:alert(1)';",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["window.location.href = 'https://example.com';"],
    }
);

ruleTester.run(
    "no-nonnull-assertion-on-security-input",
    getPluginRule("no-nonnull-assertion-on-security-input"),
    {
        invalid: [
            {
                code: "const safe = userInput!;",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["const safe = verifiedInput;"],
    }
);

ruleTester.run(
    "no-postmessage-without-origin-allowlist",
    getPluginRule("no-postmessage-without-origin-allowlist"),
    {
        invalid: [
            {
                code: "target.postMessage(data, '*');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "target.postMessage(data, origin);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["target.postMessage(data, 'https://example.com');"],
    }
);

ruleTester.run(
    "no-message-event-without-origin-check",
    getPluginRule("no-message-event-without-origin-check"),
    {
        invalid: [
            {
                code: "window.addEventListener('message', (event) => { consume(event.data); });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "window.onmessage = ({ data }) => { consume(data); };",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "window.addEventListener('message', (event) => { if (event.origin !== 'https://example.com') { return; } consume(event.data); });",
            "window.onmessage = ({ data, origin }) => { if (origin === 'https://example.com') { consume(data); } };",
            "window.addEventListener('message', (event) => { consume(event.origin); });",
        ],
    }
);

ruleTester.run(
    "no-unsafe-cast-to-trusted-types",
    getPluginRule("no-unsafe-cast-to-trusted-types"),
    {
        invalid: [
            {
                code: "const trusted = userHtml as TrustedHTML;",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["const trusted = policy.createHTML(userHtml) as TrustedHTML;"],
    }
);

ruleTester.run(
    "no-trusted-types-policy-pass-through",
    getPluginRule("no-trusted-types-policy-pass-through"),
    {
        invalid: [
            {
                code: "trustedTypes.createPolicy('default', { createHTML: (value) => value });",
                errors: [
                    {
                        data: { methodName: "createHTML" },
                        messageId: "default",
                    },
                ],
            },
            {
                code: "trustedTypes.createPolicy('default', { createScriptURL(value) { return value; } });",
                errors: [
                    {
                        data: { methodName: "createScriptURL" },
                        messageId: "default",
                    },
                ],
            },
        ],
        valid: [
            "trustedTypes.createPolicy('default', { createHTML: (value) => sanitize(value) });",
            "trustedTypes.createPolicy('default', { createScriptURL(value) { return sanitizeUrl(value); } });",
        ],
    }
);

ruleTester.run(
    "no-angular-sanitization-trusted-urls",
    getPluginRule("no-angular-sanitization-trusted-urls"),
    {
        invalid: [
            {
                code: "$compileProvider.aHrefSanitizationTrustedUrlList('.*');",
                errors: [{ messageId: "noSanitizationTrustedUrls" }],
            },
        ],
        valid: ["aHrefSanitizationTrustedUrlList('.*')"],
    }
);

ruleTester.run(
    "no-angularjs-bypass-sce",
    getPluginRule("no-angularjs-bypass-sce"),
    {
        invalid: [
            {
                code: "$sce.trustAsHtml('XSS')",
                errors: [{ messageId: "doNotBypass" }],
            },
            {
                code: "$sceProvider.enabled(false)",
                errors: [{ messageId: "doNotBypass" }],
            },
        ],
        valid: ["$sceProvider.enabled(true)", "$sce.trustAsHtml('')"],
    }
);

ruleTester.run(
    "no-angularjs-enable-svg",
    getPluginRule("no-angularjs-enable-svg"),
    {
        invalid: [
            {
                code: "$sanitizeProvider.enableSvg(true)",
                errors: [{ messageId: "doNotEnableSVG" }],
            },
        ],
        valid: [
            "$sanitizeProvider.enableSvg(false)",
            "$sanitizeProvider.enableSvg()",
        ],
    }
);

ruleTester.run(
    "no-angularjs-sanitization-whitelist",
    getPluginRule("no-angularjs-sanitization-whitelist"),
    {
        invalid: [
            {
                code: "$compileProvider.imgSrcSanitizationWhitelist('.*');",
                errors: [{ messageId: "noSanitizationWhitelist" }],
            },
        ],
        valid: ["x.aHrefSanitizationWhitelist('.*')"],
    }
);

ruleTester.run("no-cookies", getPluginRule("no-cookies"), {
    invalid: [
        {
            code: "document.cookie = '...';",
            errors: [{ messageId: "doNotUseCookies" }],
        },
    ],
    valid: ["const document2 = { cookie: '' }; document2.cookie = 'x';"],
});

ruleTester.run("no-document-domain", getPluginRule("no-document-domain"), {
    invalid: [
        {
            code: "document.domain = 'example.com';",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        {
            code: "interface DocumentLikeAPI { domain: string; } const doc = { domain: '' } as DocumentLikeAPI; doc.domain = 'x';",
            languageOptions: tsLanguageOptions,
        },
    ],
});

ruleTester.run("no-document-write", getPluginRule("no-document-write"), {
    invalid: [
        {
            code: "window.document.write('x');",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["document.write();", "document.write('x', 'y');"],
});

ruleTester.run(
    "no-electron-allow-running-insecure-content",
    getPluginRule("no-electron-allow-running-insecure-content"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { allowRunningInsecureContent: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { allowRunningInsecureContent: false } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { allowRunningInsecureContent: false } });",
            'new BrowserView({ webPreferences: { "allowRunningInsecureContent": false } });',
        ],
    }
);

ruleTester.run(
    "no-electron-dangerous-blink-features",
    getPluginRule("no-electron-dangerous-blink-features"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { enableBlinkFeatures: 'CSSVariables,LayoutNG' } });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "new BrowserView({ webPreferences: { enableBlinkFeatures: `OverlayScrollbars` } });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { enableBlinkFeatures: '' } });",
            "new BrowserWindow({ webPreferences: { enableBlinkFeatures: `   ` } });",
            "new BrowserWindow({ webPreferences: { nodeIntegration: false } });",
        ],
    }
);

ruleTester.run(
    "no-electron-disable-context-isolation",
    getPluginRule("no-electron-disable-context-isolation"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { contextIsolation: false } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { contextIsolation: true } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { contextIsolation: true } });",
        ],
    }
);

ruleTester.run(
    "no-electron-disable-sandbox",
    getPluginRule("no-electron-disable-sandbox"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { sandbox: false } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { sandbox: true } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { sandbox: true } });",
            "new BrowserWindow({ webPreferences: { nodeIntegration: true } });",
        ],
    }
);

ruleTester.run(
    "no-electron-disable-web-security",
    getPluginRule("no-electron-disable-web-security"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { webSecurity: false } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { webSecurity: true } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { webSecurity: true } });",
            'new BrowserView({ webPreferences: { "webSecurity": true } });',
        ],
    }
);

ruleTester.run(
    "no-electron-enable-remote-module",
    getPluginRule("no-electron-enable-remote-module"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { enableRemoteModule: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { enableRemoteModule: false } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { enableRemoteModule: false } });",
        ],
    }
);

ruleTester.run(
    "no-electron-enable-webview-tag",
    getPluginRule("no-electron-enable-webview-tag"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { webviewTag: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { webviewTag: false } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { webviewTag: false } });",
        ],
    }
);

ruleTester.run(
    "no-electron-experimental-features",
    getPluginRule("no-electron-experimental-features"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { experimentalFeatures: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { experimentalFeatures: false } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { experimentalFeatures: false } });",
            'new BrowserView({ webPreferences: { "experimentalFeatures": false } });',
        ],
    }
);

ruleTester.run(
    "no-electron-expose-raw-ipc-renderer",
    getPluginRule("no-electron-expose-raw-ipc-renderer"),
    {
        invalid: [
            {
                code: "contextBridge.exposeInMainWorld('api', ipcRenderer);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "contextBridge.exposeInMainWorld('api', { send: ipcRenderer.send, invoke: ipcRenderer.invoke });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "contextBridge.exposeInMainWorld('api', { send(channel, payload) { ipcRenderer.send(channel, payload); } });",
            "contextBridge.exposeInMainWorld('api', { ping: () => ipcRenderer.invoke('ping') });",
        ],
    }
);

ruleTester.run(
    "no-electron-insecure-certificate-error-handler",
    getPluginRule("no-electron-insecure-certificate-error-handler"),
    {
        invalid: [
            {
                code: "app.on('certificate-error', (event, webContents, url, error, certificate, callback) => { callback(true); });",
                errors: [{ messageId: "default" }],
            },
            {
                code: "session.defaultSession.on('certificate-error', function (_event, _webContents, _url, _error, _certificate, done) { done(true); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "app.on('certificate-error', (event, webContents, url, error, certificate, callback) => { callback(false); });",
            "app.on('ready', () => {});",
            "app.on('certificate-error', (_event, _webContents, _url, _error, _certificate, done) => { const value = true; done(value); });",
        ],
    }
);

ruleTester.run(
    "no-electron-node-integration",
    getPluginRule("no-electron-node-integration"),
    {
        invalid: [
            {
                code: "new BrowserWindow({ webPreferences: { nodeIntegration: true } });",
                errors: [{ messageId: "default" }],
                output: "new BrowserWindow({ webPreferences: { nodeIntegration: false } });",
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { nodeIntegration: false } });",
        ],
    }
);

ruleTester.run(
    "no-electron-permission-check-handler-allow-all",
    getPluginRule("no-electron-permission-check-handler-allow-all"),
    {
        invalid: [
            {
                code: "session.defaultSession.setPermissionCheckHandler(() => true);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "session.defaultSession.setPermissionCheckHandler(function () { return true; });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "session.defaultSession.setPermissionCheckHandler((_webContents, permission) => permission === 'fullscreen');",
            "session.defaultSession.setPermissionCheckHandler(() => isTrustedRequest());",
        ],
    }
);

ruleTester.run(
    "no-electron-untrusted-open-external",
    getPluginRule("no-electron-untrusted-open-external"),
    {
        invalid: [
            {
                code: "shell.openExternal('http://example.com');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "shell.openExternal(url);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "electron.shell.openExternal('file:///tmp/payload');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "const host = 'example.com'; shell.openExternal('https://' + host);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "shell.openExternal('https://example.com');",
            "shell.openExternal('mailto:security@example.com');",
            "shell.openExternal(`https://example.com/path`);",
        ],
    }
);

ruleTester.run("no-html-method", getPluginRule("no-html-method"), {
    invalid: [
        {
            code: "$('p').html('XSS');",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "element.html('');",
        "element.html(null);",
        "test.html()",
    ],
});

ruleTester.run("no-inner-html", getPluginRule("no-inner-html"), {
    invalid: [
        {
            code: "element.innerHTML = 'x';",
            errors: [{ messageId: "noInnerHtml" }],
        },
        {
            code: "element.insertAdjacentHTML('beforebegin', 'foo');",
            errors: [{ messageId: "noInsertAdjacentHTML" }],
        },
    ],
    valid: [
        "element.innerHTML = '';",
        "element.insertAdjacentHTML('beforebegin', '');",
    ],
});

ruleTester.run("no-insecure-random", getPluginRule("no-insecure-random"), {
    invalid: [
        {
            code: "Math.random();",
            errors: [{ messageId: "default" }],
        },
        {
            code: "require('chance');",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["Math.random;", "require('random-package');"],
});

ruleTester.run("no-insecure-url", getPluginRule("no-insecure-url"), {
    invalid: [
        {
            code: "const x = 'http://www.example.com';",
            errors: [{ messageId: "doNotUseInsecureUrl" }],
            output: 'const x = "https://www.example.com";',
        },
        {
            code: 'const Component = () => <svg someOtherAttribute="http://ban-example.com/" />;',
            errors: [{ messageId: "doNotUseInsecureUrl" }],
            languageOptions: tsReactLanguageOptions,
            output: 'const Component = () => <svg someOtherAttribute="https://ban-example.com/" />;',
        },
    ],
    valid: [
        "const x = 'https://www.example.com';",
        {
            code: 'const Component = () => <svg xmlns="http://www.w3.org/2000/svg" />;',
            languageOptions: tsReactLanguageOptions,
        },
    ],
});

ruleTester.run("no-msapp-exec-unsafe", getPluginRule("no-msapp-exec-unsafe"), {
    invalid: [
        {
            code: "MSApp.execUnsafeLocalFunction(testfunc)",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["MSApp.execUnsafeLocalFunction()"],
});

ruleTester.run(
    "no-postmessage-star-origin",
    getPluginRule("no-postmessage-star-origin"),
    {
        invalid: [
            {
                code: "window.postMessage(message, '*');",
                errors: [
                    {
                        messageId: "default",
                        suggestions: [
                            {
                                messageId: "replaceWithExplicitOrigin",
                                output: "window.postMessage(message, location.origin);",
                            },
                        ],
                    },
                ],
            },
        ],
        valid: [
            "window.postMessage('data', 'https://target.domain');",
            {
                code: "class WindowLike { postMessage(): void {} } const w = new WindowLike(); w.postMessage('test', 'https://example.com');",
                languageOptions: tsLanguageOptions,
            },
        ],
    }
);

ruleTester.run(
    "no-range-create-contextual-fragment",
    getPluginRule("no-range-create-contextual-fragment"),
    {
        invalid: [
            {
                code: "range.createContextualFragment(userHtml);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "range.createContextualFragment('');",
            "range.createContextualFragment(sanitize(userHtml));",
        ],
    }
);

ruleTester.run("no-set-html-unsafe", getPluginRule("no-set-html-unsafe"), {
    invalid: [
        {
            code: "element.setHTMLUnsafe(userHtml);",
            errors: [{ messageId: "default" }],
        },
        {
            code: "shadowRoot['setHTMLUnsafe'](markup);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["element.setHTMLUnsafe('');", "element.setHTML(userHtml);"],
});

ruleTester.run("no-script-text", getPluginRule("no-script-text"), {
    invalid: [
        {
            code: "document.createElement('script').text = userCode;",
            errors: [{ messageId: "default" }],
        },
        {
            code: "const scriptElement: HTMLScriptElement = document.createElement('script'); scriptElement.textContent = userCode;",
            errors: [{ messageId: "default" }],
            languageOptions: tsLanguageOptions,
        },
        {
            code: "document.currentScript.innerText = bootstrapCode;",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "document.createElement('script').text = '';",
        {
            code: "const node: HTMLElement = document.createElement('div'); node.textContent = userText;",
            languageOptions: tsLanguageOptions,
        },
        "element.textContent = userText;",
    ],
});

ruleTester.run("no-unsafe-alloc", getPluginRule("no-unsafe-alloc"), {
    invalid: [
        {
            code: "Buffer.allocUnsafe(10);",
            errors: [{ messageId: "default" }],
            output: "Buffer.alloc(10);",
        },
    ],
    valid: ["Buffer.allocUnsafe(0);", "Buffer.allocUnsafeSlow(0);"],
});

ruleTester.run(
    "no-node-tls-reject-unauthorized-zero",
    getPluginRule("no-node-tls-reject-unauthorized-zero"),
    {
        invalid: [
            {
                code: "process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';",
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
            {
                code: "process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;",
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
        ],
        valid: [
            "process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';",
            "process.env.TLS_REJECT_UNAUTHORIZED = '0';",
            "NODE_TLS_REJECT_UNAUTHORIZED = '0';",
        ],
    }
);

ruleTester.run("no-winjs-html-unsafe", getPluginRule("no-winjs-html-unsafe"), {
    invalid: [
        {
            code: "WinJS.Utilities.setInnerHTMLUnsafe(element, text);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["element.insertAdjacentHTMLUnsafe = 'test';"],
});

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
                code: "window.open('https://example.com', '_blank', features);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "window.open('https://example.com', '_self');",
            "window.open('https://example.com', '_blank', 'noopener');",
            "window.open('https://example.com', '_blank', 'noopener,noreferrer');",
            "open('https://example.com', '_blank');",
        ],
    }
);

ruleTester.run("common-config-compat", getPluginRule("no-insecure-url"), {
    invalid: [
        {
            code: "const x = 'http://untrusted.example';",
            errors: [{ messageId: "doNotUseInsecureUrl" }],
            languageOptions: esModuleLanguageOptions,
            output: 'const x = "https://untrusted.example";',
        },
    ],
    valid: ["const x = 'https://trusted.example';"],
});
