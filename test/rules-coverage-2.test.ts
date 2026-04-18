import { createRuleTester, getPluginRule } from "./_internal/ruleTester";
import { esModuleLanguageOptions } from "./_internal/test-utils";

const ruleTester = createRuleTester();

ruleTester.run(
    "no-angular-bypass-security-trust-html",
    getPluginRule("no-angular-bypass-security-trust-html"),
    {
        invalid: [
            {
                code: "sanitizer['bypassSecurityTrustHtml'](html);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: ["sanitizer.sanitizeHtml(html);", "sanitizer[key](html);"],
    }
);

ruleTester.run(
    "no-angular-innerhtml-binding",
    getPluginRule("no-angular-innerhtml-binding"),
    {
        invalid: [
            {
                code: "const tpl = `[innerHTML]= class`;",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "const x = 42;",
            `const tpl = \`[innerHTML]=\${dynamicValue}\`;`,
            "const x = 'just a plain string';",
        ],
    }
);

ruleTester.run(
    "no-angularjs-bypass-sce",
    getPluginRule("no-angularjs-bypass-sce"),
    {
        invalid: [
            {
                code: "foo.trustAs(SCE.RESOURCE_URL, userUrl);",
                errors: [{ messageId: "doNotBypass" }],
            },
            {
                code: "$sceProvider.enabled(false);",
                errors: [{ messageId: "doNotBypass" }],
            },
        ],
        valid: [
            "$sce.trustAsHtml('');",
            "$sceProvider.enabled(true);",
            "foo.trustAs('');",
        ],
    }
);

ruleTester.run(
    "no-node-vm-run-in-context",
    getPluginRule("no-node-vm-run-in-context"),
    {
        invalid: [
            {
                code: "require('vm').runInContext('var x = 1;', context);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "const { Script } = require('vm'); new Script('var x = 1;');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "import * as vm from 'vm'; new vm.Script('code');",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
        ],
        valid: [
            "new require('vm').Script('var x = 1;');",
            "const { [key]: val } = require('vm');",
        ],
    }
);

ruleTester.run(
    "no-node-vm-source-text-module",
    getPluginRule("no-node-vm-source-text-module"),
    {
        invalid: [
            {
                code: "import { SourceTextModule } from 'vm'; new SourceTextModule('code');",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "const vm = require('vm'); new vm.SourceTextModule('code');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "new require('vm').SourceTextModule('code');",
            "const { [key]: val } = require('vm');",
        ],
    }
);

ruleTester.run(
    "no-electron-expose-raw-ipc-renderer",
    getPluginRule("no-electron-expose-raw-ipc-renderer"),
    {
        invalid: [
            {
                code: "contextBridge.exposeInMainWorld('api', electron.ipcRenderer.on);",
                errors: [{ messageId: "default" }],
            },
            {
                code: "contextBridge.exposeInMainWorld('api', [ipcRenderer, otherThing]);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "contextBridge.exposeInIsolatedWorld(1, 'api', ipcRenderer);",
            "contextBridge.exposeInMainWorld('api', () => 42);",
        ],
    }
);

ruleTester.run(
    "no-node-worker-threads-eval",
    getPluginRule("no-node-worker-threads-eval"),
    {
        invalid: [
            {
                code: "const { Worker } = require('worker_threads'); new Worker('./script.js', { eval: true });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "new require('worker_threads').Worker('./script.js', { eval: true });",
        ],
    }
);

ruleTester.run(
    "no-insecure-tls-agent-options",
    getPluginRule("no-insecure-tls-agent-options"),
    {
        invalid: [
            {
                code: "const opts = { rejectUnauthorized: false };",
                errors: [{ messageId: "default" }],
                output: "const opts = { rejectUnauthorized: true };",
            },
        ],
        valid: ["const opts = { rejectUnauthorized: true };"],
    }
);

ruleTester.run(
    "no-electron-unchecked-ipc-sender",
    getPluginRule("no-electron-unchecked-ipc-sender"),
    {
        invalid: [
            {
                code: "ipcMain.on('getData', (event) => { doSomething(); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "ipcMain.on('getData', (event) => { if (event.sender.getURL() !== trusted) return; doSomething(); });",
            "ipcMain.removeHandler('getData');",
        ],
    }
);

ruleTester.run(
    "no-electron-unrestricted-navigation",
    getPluginRule("no-electron-unrestricted-navigation"),
    {
        invalid: [
            {
                code: "webContents.setWindowOpenHandler(() => ({ action: 'allow' }));",
                errors: [{ messageId: "default" }],
            },
            {
                code: "webContents.on('will-navigate', (event) => { console.log('navigating'); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "webContents.setWindowOpenHandler(() => ({ action: 'deny' }));",
            "webContents.on('will-navigate', (event) => { event.preventDefault(); });",
        ],
    }
);

ruleTester.run(
    "no-electron-untrusted-open-external",
    getPluginRule("no-electron-untrusted-open-external"),
    {
        invalid: [
            {
                code: "shell.openExternal('ftp://example.com');",
                errors: [{ messageId: "default" }],
            },
            {
                code: "electron.shell.openExternal('ftp://badsite.com');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "shell.openExternal('https://example.com');",
            "shell.openExternal('mailto:user@example.com');",
        ],
    }
);

ruleTester.run(
    "no-electron-permission-check-handler-allow-all",
    getPluginRule("no-electron-permission-check-handler-allow-all"),
    {
        invalid: [
            {
                code: "session.setPermissionCheckHandler(() => true);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "session.setPermissionCheckHandler((wc, permission) => permission === 'camera');",
            "session.setPermissionCheckHandler(() => false);",
        ],
    }
);

ruleTester.run(
    "no-electron-insecure-certificate-verify-proc",
    getPluginRule("no-electron-insecure-certificate-verify-proc"),
    {
        invalid: [
            {
                code: "app.setCertificateVerifyProc((req, callback) => { callback(0); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "app.setCertificateVerifyProc((req, callback) => { callback(-2); });",
            "app.setCertificateVerifyProc((req, { cbFn }) => { cbFn(0); });",
        ],
    }
);

ruleTester.run(
    "no-electron-insecure-permission-request-handler",
    getPluginRule("no-electron-insecure-permission-request-handler"),
    {
        invalid: [
            {
                code: "session.setPermissionRequestHandler((wc, perm, callback) => { callback(true); });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "session.setPermissionRequestHandler((wc, perm, cb) => { cb(false); });",
            "session.setPermissionRequestHandler((wc, perm, { fn }) => { fn(true); });",
        ],
    }
);

ruleTester.run(
    "no-child-process-exec",
    getPluginRule("no-child-process-exec"),
    {
        invalid: [
            {
                code: "import { exec } from 'child_process'; exec('ls');",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "require('child_process').exec('ls -la');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            {
                code: "import { spawn } from 'child_process'; spawn('ls', ['-la']);",
                languageOptions: esModuleLanguageOptions,
            },
        ],
    }
);

ruleTester.run(
    "no-node-tls-legacy-protocol",
    getPluginRule("no-node-tls-legacy-protocol"),
    {
        invalid: [
            {
                code: "tls.DEFAULT_MIN_VERSION = 'TLSv1';",
                errors: [{ messageId: "default" }],
            },
            {
                code: "https.request({ secureProtocol: 'TLSv1_method' });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "tls.DEFAULT_MIN_VERSION = 'TLSv1.3';",
            "https.request({ minVersion: 'TLSv1.2' });",
        ],
    }
);

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
        ],
        valid: [
            "process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';",
            "process.env.OTHER_VAR = '0';",
        ],
    }
);

ruleTester.run("no-unsafe-alloc", getPluginRule("no-unsafe-alloc"), {
    invalid: [
        {
            code: "Buffer.allocUnsafe(1024);",
            errors: [{ messageId: "default" }],
            output: "Buffer.alloc(1024);",
        },
    ],
    valid: ["Buffer.alloc(1024);", "Buffer.allocUnsafe(0);"],
});

ruleTester.run(
    "no-dynamic-import-unsafe-url",
    getPluginRule("no-dynamic-import-unsafe-url"),
    {
        invalid: [
            {
                code: "import('data:text/javascript,alert(1)');",
                errors: [{ messageId: "default" }],
                languageOptions: esModuleLanguageOptions,
            },
        ],
        valid: [
            {
                code: "import('./module.js');",
                languageOptions: esModuleLanguageOptions,
            },
            {
                code: "import(blobUrl);",
                languageOptions: esModuleLanguageOptions,
            },
        ],
    }
);

ruleTester.run("no-set-html-unsafe", getPluginRule("no-set-html-unsafe"), {
    invalid: [
        {
            code: "element.setHTMLUnsafe(html);",
            errors: [{ messageId: "default" }],
        },
        {
            code: "document.setHTMLUnsafe(userContent);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        "element.setHTML(html);",
        "element.setHTMLUnsafe('');",
        "element.setInnerHtml(html);",
    ],
});

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
                code: "window.Document.parseHTMLUnsafe(userHtml);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            "document.parseHTMLUnsafe(userHtml);",
            "Document.parseHTMLUnsafe('');",
        ],
    }
);

ruleTester.run(
    "no-angularjs-sanitization-whitelist",
    getPluginRule("no-angularjs-sanitization-whitelist"),
    {
        invalid: [
            {
                code: "$compileProvider.aHrefSanitizationWhitelist(/.*unsafe/);",
                errors: [{ messageId: "noSanitizationWhitelist" }],
            },
            {
                code: "$compileProvider.imgSrcSanitizationWhitelist(/.*data/);",
                errors: [{ messageId: "noSanitizationWhitelist" }],
            },
        ],
        valid: ["otherProvider.aHrefSanitizationWhitelist(/pattern/);"],
    }
);
