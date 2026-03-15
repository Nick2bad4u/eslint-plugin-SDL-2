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

ruleTester.run("no-winjs-html-unsafe", getPluginRule("no-winjs-html-unsafe"), {
    invalid: [
        {
            code: "WinJS.Utilities.setInnerHTMLUnsafe(element, text);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: ["element.insertAdjacentHTMLUnsafe = 'test';"],
});

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
