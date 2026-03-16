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
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { enableRemoteModule: false } });",
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
            },
        ],
        valid: [
            "new BrowserWindow({ webPreferences: { nodeIntegration: false } });",
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
                errors: [{ messageId: "default" }],
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

ruleTester.run("no-unsafe-alloc", getPluginRule("no-unsafe-alloc"), {
    invalid: [
        {
            code: "Buffer.allocUnsafe(10);",
            errors: [{ messageId: "default" }],
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
                errors: [{ messageId: "default" }],
            },
            {
                code: "process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;",
                errors: [{ messageId: "default" }],
            },
            {
                code: "process.env.NODE_TLS_REJECT_UNAUTHORIZED = `0`;",
                errors: [{ messageId: "default" }],
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
