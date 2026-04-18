/**
 * Additional tests targeting uncovered branches in low-coverage rules.
 *
 * The primary test file (rules-sdl.test.ts) covers happy-path scenarios. This
 * file is intentionally focused on edge-cases, alternative code paths, and
 * variant AST shapes that are not exercised by the baseline tests, specifically
 * to push branch and statement coverage toward the 90% target.
 */
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";
import {
    esModuleLanguageOptions,
    tsReactLanguageOptions,
} from "./_internal/test-utils";

const ruleTester = createRuleTester();

// ─── no-location-javascript-url ──────────────────────────────────────────────
// Baseline covers only the AssignmentExpression path with a Literal value.
// Missing: CallExpression (assign/replace/open), template literal, SpreadElement.
ruleTester.run(
    "no-location-javascript-url",
    getPluginRule("no-location-javascript-url"),
    {
        invalid: [
            // CallExpression: location.assign
            {
                code: "location.assign('javascript:alert(1)');",
                errors: [{ messageId: "default" }],
            },
            // CallExpression: location.replace
            {
                code: "location.replace('javascript:void(0)');",
                errors: [{ messageId: "default" }],
            },
            // CallExpression: window.open
            {
                code: "window.open('javascript:alert(1)', '_blank');",
                errors: [{ messageId: "default" }],
            },
            // CallExpression: window.location.replace (member chain)
            {
                code: "window.location.replace('javascript:alert(document.cookie)');",
                errors: [{ messageId: "default" }],
            },
            // AssignmentExpression with template literal (no-expression TemplateLiteral)
            {
                code: "location.href = `javascript:alert(1)`;",
                errors: [{ messageId: "default" }],
            },
            // AssignmentExpression: window.location.href
            {
                code: "window.location.href = 'javascript:void(0)';",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // CallExpression with safe URL - no report
            "location.assign('https://example.com');",
            // CallExpression with dynamic argument - getStaticStringValue returns undefined
            "location.replace(someUrl);",
            // Non-navigation method - not assign/replace/open
            "location.reload();",
            // SpreadElement as first argument - early return
            "location.assign(...args);",
            // CallExpression with non-MemberExpression callee - early return
            "assign('javascript:alert(1)');",
            // Template literal with expression - getStaticStringValue returns undefined
            `location.href = \`javascript:\${userInput}\`;`,
            // Safe template literal
            "location.assign(`https://example.com`);",
            // Window.open with safe URL
            "window.open('https://example.com');",
        ],
    }
);

// ─── no-electron-webview-allowpopups ─────────────────────────────────────────
// Baseline covers only the bare boolean attribute `<webview allowpopups />`.
// Missing: explicit boolean/string attribute values, non-webview element, spread.
ruleTester.run(
    "no-electron-webview-allowpopups",
    getPluginRule("no-electron-webview-allowpopups"),
    {
        invalid: [
            // Literal boolean true in JSXExpressionContainer
            {
                code: 'const v = <webview allowpopups={true} src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
            // Literal string "true" (string that is not "false")
            {
                code: 'const v = <webview allowpopups="true" src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
            // Literal string "yes" - not "false", so truthy
            {
                code: 'const v = <webview allowpopups="yes" src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
            // Numeric literal in JSXExpressionContainer (e.g. {0}) - isTruthyJsxAttributeValue
            // only treats boolean false and string "false" as falsy; everything else (incl. numbers) → truthy
            {
                code: 'const v = <webview allowpopups={0} src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
            // JSXExpressionContainer with non-Literal expression (variable) - truthy
            {
                code: 'const v = <webview allowpopups={allowed} src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
        ],
        valid: [
            // Explicit boolean false in JSXExpressionContainer
            {
                code: 'const v = <webview allowpopups={false} src="https://x.com" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // String "false" - normalized false
            {
                code: 'const v = <webview allowpopups="false" src="https://x.com" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // String "FALSE" - case-insensitive false
            {
                code: 'const v = <webview allowpopups="FALSE" src="https://x.com" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // Numeric literal in JSXExpressionContainer - the rule still flags it (isTruthyJsxAttributeValue only
            // treats `false` boolean and "false" string as falsy) so 0 is treated as a non-false non-boolean expression
            // → truthy path → invalid This case is intentionally left out (tested in invalid block below) Non-webview
            // element - isJsxWebviewElement returns false
            {
                code: "<div allowpopups />;",
                languageOptions: tsReactLanguageOptions,
            },
            // JSX spread attribute - type !== "JSXAttribute", gets skipped via continue
            {
                code: 'const v = <webview {...spreadAttrs} src="https://x.com" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // Non-webview JSXMemberExpression element (Foo.Bar) - isJsxWebviewElement returns false
            {
                code: "const v = <Electron.webview allowpopups />;",
                languageOptions: tsReactLanguageOptions,
            },
        ],
    }
);

// ─── no-electron-webview-node-integration ────────────────────────────────────
// Baseline covers only the bare `nodeintegration` attribute.
// Missing: boolean values, string "false", webpreferences with nodeintegration,
// namespaced attribute name path.
ruleTester.run(
    "no-electron-webview-node-integration",
    getPluginRule("no-electron-webview-node-integration"),
    {
        invalid: [
            // Explicit boolean true
            {
                code: 'const v = <webview nodeintegration={true} src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
            // Explicit string "true"
            {
                code: 'const v = <webview nodeintegration="true" src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
            // nodeintegrationinsubframes attribute (alternative attribute name)
            {
                code: 'const v = <webview nodeintegrationinsubframes src="https://x.com" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
                output: 'const v = <webview  src="https://x.com" />;',
            },
            // Webpreferences with nodeintegration in string value
            {
                code: 'const v = <webview webpreferences="nodeintegration=yes" />;',
                errors: [{ messageId: "default" }],
                languageOptions: tsReactLanguageOptions,
            },
        ],
        valid: [
            // Explicit boolean false - not flagged
            {
                code: 'const v = <webview nodeintegration={false} src="https://x.com" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // String "false" - not flagged
            {
                code: 'const v = <webview nodeintegration="false" src="https://x.com" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // Webpreferences without nodeintegration
            {
                code: 'const v = <webview webpreferences="sandbox=yes" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // Non-nodeintegration attribute
            {
                code: 'const v = <webview src="https://x.com" />;',
                languageOptions: tsReactLanguageOptions,
            },
            // JSXSpreadAttribute skipped
            {
                code: "const v = <webview {...props} />;",
                languageOptions: tsReactLanguageOptions,
            },
        ],
    }
);

// ─── no-insecure-random ───────────────────────────────────────────────────────
// Baseline covers require('chance') and Math.random().
// Missing: ImportDeclaration handler for ESM imports of banned libraries.
ruleTester.run("no-insecure-random", getPluginRule("no-insecure-random"), {
    invalid: [
        // ImportDeclaration: import 'chance'
        {
            code: "import 'chance';",
            errors: [{ messageId: "default" }],
            languageOptions: esModuleLanguageOptions,
        },
        // ImportDeclaration: import named from banned library
        {
            code: "import Chance from 'chance';",
            errors: [{ messageId: "default" }],
            languageOptions: esModuleLanguageOptions,
        },
        // ImportDeclaration: import 'random-int'
        {
            code: "import randomInt from 'random-int';",
            errors: [{ messageId: "default" }],
            languageOptions: esModuleLanguageOptions,
        },
        // ImportDeclaration: import 'random-float'
        {
            code: "import 'random-float';",
            errors: [{ messageId: "default" }],
            languageOptions: esModuleLanguageOptions,
        },
        // ImportDeclaration: import 'unique-random'
        {
            code: "import fn from 'unique-random';",
            errors: [{ messageId: "default" }],
            languageOptions: esModuleLanguageOptions,
        },
        // Require('random-number') (already tested, but ensures require path covered)
        {
            code: "const rn = require('random-number');",
            errors: [{ messageId: "default" }],
        },
        // PseudoRandomBytes without type info (identifier-based check)
        {
            code: "crypto.pseudoRandomBytes(16);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        // Import of non-banned library
        {
            code: "import 'lodash';",
            languageOptions: esModuleLanguageOptions,
        },
        {
            code: "import crypto from 'node:crypto';",
            languageOptions: esModuleLanguageOptions,
        },
        // Require with non-string argument
        "require(moduleName);",
        // Require with non-banned library
        "require('safe-random-lib');",
    ],
});

// ─── no-child-process-shell-true ─────────────────────────────────────────────
// Baseline covers only `spawn('cmd', [...], { shell: true })`.
// Missing: MemberExpression callee, Literal property key, SpreadElement in args.
ruleTester.run(
    "no-child-process-shell-true",
    getPluginRule("no-child-process-shell-true"),
    {
        invalid: [
            // MemberExpression callee: childProcess.spawn
            {
                code: "childProcess.spawn('cmd', ['/c', cmd], { shell: true });",
                errors: [{ messageId: "default" }],
            },
            // MemberExpression callee: cp.execFile
            {
                code: "cp.execFile('node', ['script.js'], { shell: true });",
                errors: [{ messageId: "default" }],
            },
            // Literal property key: { "shell": true }
            {
                code: 'spawn("cmd", [], { "shell": true });',
                errors: [{ messageId: "default" }],
            },
            // execFile with MemberExpression callee
            {
                code: "childProcess.execFile('node', ['script.js'], { shell: true });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // MemberExpression callee: shell: false
            "childProcess.spawn('cmd', [], { shell: false });",
            // SpreadElement in arguments - continue (skip spread args)
            "spawn('cmd', ...args);",
            // Non-target method: exec (not spawn/execFile)
            "childProcess.exec('cmd');",
            // No shell option at all
            "childProcess.spawn('node', ['script.js']);",
            // Non-boolean shell value (null) - not truthy literal
            "spawn('cmd', [], { shell: null });",
        ],
    }
);

// ─── no-angularjs-sce-resource-url-wildcard ──────────────────────────────────
// Baseline covers `['self', '*']`.
// Missing: computed bracket member, no args, non-array arg, null/spread elements.
ruleTester.run(
    "no-angularjs-sce-resource-url-wildcard",
    getPluginRule("no-angularjs-sce-resource-url-wildcard"),
    {
        invalid: [
            // Computed bracket member access: provider['resourceUrlWhitelist']
            {
                code: "$sceDelegateProvider['resourceUrlWhitelist'](['*']);",
                errors: [{ messageId: "default" }],
            },
            // Array with multiple elements including wildcard
            {
                code: "$sceDelegateProvider.resourceUrlWhitelist(['self', '**']);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // No arguments - firstArgument is undefined → early return
            "$sceDelegateProvider.resourceUrlWhitelist();",
            // Non-array argument - type !== "ArrayExpression" → early return
            "$sceDelegateProvider.resourceUrlWhitelist(urls);",
            // SpreadElement as first arg - type === "SpreadElement" → early return
            "$sceDelegateProvider.resourceUrlWhitelist(...urlArrays);",
            // Array with null element - element === null → continue
            "$sceDelegateProvider.resourceUrlWhitelist([null]);",
            // Array with spread element - element.type === "SpreadElement" → continue
            "$sceDelegateProvider.resourceUrlWhitelist([...safeSources]);",
            // Array with non-string element - typeof elementNode.value !== "string" → continue
            "$sceDelegateProvider.resourceUrlWhitelist([42]);",
            // Array with non-wildcard elements only
            "$sceDelegateProvider.resourceUrlWhitelist(['self', 'https://cdn.example.com']);",
        ],
    }
);

// ─── no-http-request-to-insecure-protocol ────────────────────────────────────
// Baseline covers `http.get('http://...')`.
// Missing: request method, template literal URL, SpreadElement, non-string arg.
ruleTester.run(
    "no-http-request-to-insecure-protocol",
    getPluginRule("no-http-request-to-insecure-protocol"),
    {
        invalid: [
            // Http.request method
            {
                code: "http.request('http://api.example.com/data');",
                errors: [{ messageId: "default" }],
                output: "http.request('https://api.example.com/data');",
            },
            // Template literal URL (getStaticStringValue resolves no-expression template)
            {
                code: "http.get(`http://api.example.com/status`);",
                errors: [{ messageId: "default" }],
                output: "http.get(`https://api.example.com/status`);",
            },
            // Https.get with http URL (callee object name "https" is valid)
            {
                code: "https.get('http://api.example.com/status');",
                errors: [{ messageId: "default" }],
                output: "https.get('https://api.example.com/status');",
            },
        ],
        valid: [
            // Dynamic URL (non-string first arg) - getStaticStringValue returns undefined
            "http.get(someUrl);",
            // SpreadElement as first argument - early return
            "http.get(...urlArgs);",
            // Non-request/get method: http.post - methodName not request/get
            "http.post('http://example.com');",
            // Non-"http"/"https" callee object name
            "myHttp.get('http://example.com');",
            // Https.request with https URL - not insecure
            "https.request('https://api.example.com/data');",
            // Nested callee (no direct Identifier object) - e.g. require('http').get
            "require('http').get('http://example.com');",
            // Template literal with expression (dynamic)
            `http.get(\`http://\${apiHost}/status\`);`,
        ],
    }
);

// ─── no-iframe-srcdoc ────────────────────────────────────────────────────────
// Baseline covers basic iframe paths. Missing: MemberExpression iframe name,
// setAttributeNS, JSX expression container, estree-utils getStaticJsxAttributeStringValue branches.
ruleTester.run("no-iframe-srcdoc", getPluginRule("no-iframe-srcdoc"), {
    invalid: [
        // MemberExpression object that ends in "iframe"
        {
            code: "page.contentIframe.srcdoc = userHtml;",
            errors: [{ messageId: "default" }],
        },
        // JSX with any expression in srcDoc (including variable reference) is flagged:
        // getStaticJsxAttributeStringValue returns undefined (not ""), so the empty-check
        // doesn't skip and the rule reports.
        {
            code: "const f = <iframe srcDoc={userHtml} />;",
            errors: [{ messageId: "default" }],
            languageOptions: tsReactLanguageOptions,
        },
        // JSX with srcdoc in JSXExpressionContainer with string literal
        {
            code: 'const f = <iframe srcDoc={"<b>content</b>"} />;',
            errors: [{ messageId: "default" }],
            languageOptions: tsReactLanguageOptions,
        },
        // JSX with template literal (no expressions)
        {
            code: "const f = <iframe srcDoc={`<b>template</b>`} />;",
            errors: [{ messageId: "default" }],
            languageOptions: tsReactLanguageOptions,
        },
    ],
    valid: [
        // SetAttributeNS (null, 'srcdoc', ...) is NOT flagged: the rule checks
        // getStaticStringValue(firstArgument) === 'srcdoc' but here firstArgument is
        // a null literal, so it returns early. Only setAttribute is handled properly.
        "element.setAttributeNS(null, 'srcdoc', '');",
        "element.setAttributeNS(null, 'srcdoc', userHtml);",
        // Identifier not ending in "iframe" - not flagged
        "container.srcdoc = userHtml;",
        // JSX with spread attribute (type !== "JSXAttribute")
        {
            code: "const f = <iframe {...props} />;",
            languageOptions: tsReactLanguageOptions,
        },
        // JSX with unrelated attribute name
        {
            code: 'const f = <iframe src="https://example.com" />;',
            languageOptions: tsReactLanguageOptions,
        },
        // SetAttributeNS with non-"srcdoc" attribute
        "element.setAttributeNS(null, 'src', userHtml);",
        // SetAttributeNS with SpreadElement as first arg
        "element.setAttributeNS(...args);",
    ],
});

// ─── no-nonnull-assertion-on-security-input ───────────────────────────────────
// Baseline covers only Identifier expressions (e.g., `userInput!`).
// Missing: MemberExpression path.
ruleTester.run(
    "no-nonnull-assertion-on-security-input",
    getPluginRule("no-nonnull-assertion-on-security-input"),
    {
        invalid: [
            // MemberExpression with security-sensitive property "html"
            {
                code: "const val = request.html!;",
                errors: [{ messageId: "default" }],
            },
            // MemberExpression with "origin"
            {
                code: "const val = event.origin!;",
                errors: [{ messageId: "default" }],
            },
            // MemberExpression with "token"
            {
                code: "const val = auth.token!;",
                errors: [{ messageId: "default" }],
            },
            // MemberExpression with "url"
            {
                code: "const val = config.url!;",
                errors: [{ messageId: "default" }],
            },
            // MemberExpression with "payload"
            {
                code: "const val = event.payload!;",
                errors: [{ messageId: "default" }],
            },
            // MemberExpression with "message"
            {
                code: "const val = error.message!;",
                errors: [{ messageId: "default" }],
            },
            // MemberExpression with "input"
            {
                code: "const val = form.input!;",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // MemberExpression with non-matching property name
            "const val = request.id!;",
            "const val = obj.count!;",
            "const val = config.timeout!;",
            // Computed member expression - not flagged (computed is true)
            "const val = request['html']!;",
            // Non-security identifier
            "const val = result!;",
        ],
    }
);

// ─── no-unsafe-cast-to-trusted-types ─────────────────────────────────────────
// Baseline covers only TSAsExpression with TrustedHTML.
// Missing: TSTypeAssertion (angle-bracket), TrustedScript/TrustedScriptURL,
// factory function validation paths (getExpressionCalleeName branches).
ruleTester.run(
    "no-unsafe-cast-to-trusted-types",
    getPluginRule("no-unsafe-cast-to-trusted-types"),
    {
        invalid: [
            // TSTypeAssertion: <TrustedHTML>
            {
                code: "const trusted = <TrustedHTML>unsafeValue;",
                errors: [{ messageId: "default" }],
            },
            // TSTypeAssertion: <TrustedScript>
            {
                code: "const trusted = <TrustedScript>unsafeScript;",
                errors: [{ messageId: "default" }],
            },
            // TSTypeAssertion: <TrustedScriptURL>
            {
                code: "const trusted = <TrustedScriptURL>unsafeUrl;",
                errors: [{ messageId: "default" }],
            },
            // TSAsExpression: TrustedScript
            {
                code: "const trusted = unsafeScript as TrustedScript;",
                errors: [{ messageId: "default" }],
            },
            // TSAsExpression: TrustedScriptURL
            {
                code: "const trusted = unsafeUrl as TrustedScriptURL;",
                errors: [{ messageId: "default" }],
            },
            // Non-call expression (e.g., binary expression) - getExpressionCalleeName returns undefined
            {
                code: "const trusted = (a + b) as TrustedHTML;",
                errors: [{ messageId: "default" }],
            },
            // CallExpression with non-factory callee name
            {
                code: "const trusted = encode(html) as TrustedHTML;",
                errors: [{ messageId: "default" }],
            },
            // Computed member expression callee: getExpressionCalleeName returns undefined (computed=true)
            // → isKnownTrustedFactoryCall returns false → is flagged
            {
                code: "const trusted = policy[factory](html) as TrustedHTML;",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // TSAsExpression: known factory function (Identifier callee)
            "const trusted = sanitize(html) as TrustedHTML;",
            // TSAsExpression: createHTML (Identifier callee)
            "const trusted = createHTML(html) as TrustedHTML;",
            // TSAsExpression: member expression factory (MemberExpression callee)
            "const trusted = policy.createHTML(html) as TrustedHTML;",
            // TSAsExpression: createScriptURL member
            "const trusted = policy.createScriptURL(url) as TrustedScriptURL;",
            // TSTypeAssertion: known factory sanitize
            "const trusted = <TrustedHTML>sanitize(html);",
            // TSTypeAssertion: createHTML factory
            "const trusted = <TrustedHTML>createHTML(html);",
            // TSTypeAssertion: member factory
            "const trusted = <TrustedHTML>policy.createHTML(html);",
            // TSAsExpression: non-TrustedType cast (should not flag)
            "const val = unsafeValue as string;",
            // TSTypeAssertion: non-TrustedType (no flag)
            "const val = <string>unsafeValue;",
            // TSAsExpression: computed callee (MemberExpression.computed=true) - getExpressionCalleeName
            // returns undefined because computed=true, so isKnownTrustedFactoryCall returns false → IS flagged
            // (moved to invalid block)
        ],
    }
);

// ─── no-insecure-url ─────────────────────────────────────────────────────────
// Baseline covers Literal string and JSX attribute.
// Missing: TemplateElement, varExceptions option, custom options, JSX xmlns skip.
ruleTester.run("no-insecure-url", getPluginRule("no-insecure-url"), {
    invalid: [
        // TemplateElement with insecure URL (raw match)
        {
            code: "const url = `http://www.example.com/path`;",
            errors: [{ messageId: "doNotUseInsecureUrl" }],
            output: "const url = `https://www.example.com/path`;",
        },
        // TemplateElement in tagged template
        {
            code: "fetch(`http://api.example.com/status`);",
            errors: [{ messageId: "doNotUseInsecureUrl" }],
            output: "fetch(`https://api.example.com/status`);",
        },
        // Custom blocklist option
        {
            code: "const x = 'ftp://files.example.com/file.txt';",
            errors: [{ messageId: "doNotUseInsecureUrl" }],
            options: [{ blocklist: ["ftp://"] }],
            output: null,
        },
    ],
    valid: [
        // VarExceptions option - should not apply fix (shouldAttemptFix returns false)
        {
            code: "const apiUrl = 'http://www.example.com';",
            options: [{ varExceptions: ["apiUrl"] }],
        },
        // Exceptions option - URL in exceptions list is allowed
        {
            code: "const x = 'https://www.w3.org/2000/svg';",
            options: [{ exceptions: ["https://www.w3.org/"] }],
        },
        // Secure template literal
        "const url = `https://www.example.com/path`;",
        // Template literal with expression - TemplateElement value is just the prefix
        `const url = \`https://example.com/\${path}\`;`,
        // Non-string literal (number)
        "const x = 42;",
    ],
});

// ─── no-trusted-types-policy-pass-through ────────────────────────────────────
// Baseline covers arrow function pass-through and function expression pass-through.
// Missing: window.trustedTypes (MemberExpression callee object), block statement return,
// TSAsExpression wrapped return, non-init property kind, spread property, no second arg.
ruleTester.run(
    "no-trusted-types-policy-pass-through",
    getPluginRule("no-trusted-types-policy-pass-through"),
    {
        invalid: [
            // Window.trustedTypes (MemberExpression callee object)
            {
                code: "window.trustedTypes.createPolicy('name', { createHTML: (html) => html });",
                errors: [
                    {
                        data: { methodName: "createHTML" },
                        messageId: "default",
                    },
                ],
            },
            // Block statement with single return of parameter
            {
                code: "trustedTypes.createPolicy('name', { createHTML(value) { return value; } });",
                errors: [
                    {
                        data: { methodName: "createHTML" },
                        messageId: "default",
                    },
                ],
            },
            // CreateScript factory pass-through
            {
                code: "trustedTypes.createPolicy('name', { createScript: (script) => script });",
                errors: [
                    {
                        data: { methodName: "createScript" },
                        messageId: "default",
                    },
                ],
            },
            // CreateScriptURL factory pass-through
            {
                code: "trustedTypes.createPolicy('name', { createScriptURL: (url) => url });",
                errors: [
                    {
                        data: { methodName: "createScriptURL" },
                        messageId: "default",
                    },
                ],
            },
            // TSAsExpression-wrapped return (unwrapped by unwrapTransparentExpression)
            {
                code: "trustedTypes.createPolicy('name', { createHTML: (value) => value as string });",
                errors: [
                    {
                        data: { methodName: "createHTML" },
                        messageId: "default",
                    },
                ],
            },
        ],
        valid: [
            // Non-createPolicy method - not trustedTypes.createPolicy
            "window.trustedTypes.sanitizePolicy('name', { createHTML: (html) => html });",
            // No second argument
            "trustedTypes.createPolicy('name');",
            // SpreadElement as second argument
            "trustedTypes.createPolicy('name', ...policyArgs);",
            // Non-ObjectExpression second argument
            "trustedTypes.createPolicy('name', policyObj);",
            // Spread property inside second object argument
            "trustedTypes.createPolicy('name', { ...defaultPolicy });",
            // Non-init property kind (getter)
            "trustedTypes.createPolicy('name', { get createHTML() { return (v) => v; } });",
            // Not a function expression value
            "trustedTypes.createPolicy('name', { createHTML: sanitizeHtml });",
            // Non-pass-through: sanitizes the value
            "trustedTypes.createPolicy('name', { createHTML: (value) => DOMPurify.sanitize(value) });",
            // Block body with multiple statements - isPassThroughFactory returns false
            "trustedTypes.createPolicy('name', { createHTML(value) { const safe = sanitize(value); return safe; } });",
            // First parameter is not an Identifier (destructured)
            "trustedTypes.createPolicy('name', { createHTML({ raw }) { return raw; } });",
            // Return statement with null argument (no argument)
            "trustedTypes.createPolicy('name', { createHTML(value) { return; } });",
            // Non-POLICY_FACTORY_NAMES key
            "trustedTypes.createPolicy('name', { doSomething: (value) => value });",
            // Unknown callee object (not trustedTypes or window.trustedTypes)
            "myPolicy.createPolicy('name', { createHTML: (value) => value });",
        ],
    }
);

// ─── no-document-domain ───────────────────────────────────────────────────────
// Baseline covers `document.domain = '...'` with type checker.
// Missing: without type checker - isDocumentObject identifier-based path.
ruleTester.run("no-document-domain", getPluginRule("no-document-domain"), {
    invalid: [
        // Window.document.domain - isWindowIdentifierName("window") → true
        {
            code: "window.document.domain = 'example.com';",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        // Non-document object - not flagged
        "myService.domain = 'example.com';",
        // Not a MemberExpression left side
        "domain = 'example.com';",
        // Left side is not a member with "domain" property
        "document.location = 'example.com';",
        // globalThis.document: isDocumentMemberReference checks node.object is Identifier
        // ending in "window" - "globalThis" does NOT end in "window" → not flagged
        "globalThis.document.domain = 'example.com';",
    ],
});

// ─── no-document-write ────────────────────────────────────────────────────────
// Extends coverage of isDocumentObject paths (ast-utils.ts).
ruleTester.run("no-document-write", getPluginRule("no-document-write"), {
    invalid: [
        // Window.document.write
        {
            code: "window.document.write('<p>hello</p>');",
            errors: [{ messageId: "default" }],
        },
        // Document.writeln
        {
            code: "document.writeln('<p>hello</p>');",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        // Not a document-like object
        "myObj.write('foo');",
        // Non-document identifier
        "printer.write('text');",
        // Too many arguments (not 1)
        "document.write('a', 'b');",
        // No arguments
        "document.write();",
        // globalThis.document - isWindowIdentifierName("globalThis") → false (does not end in "window")
        "globalThis.document.write('<p>hello</p>');",
    ],
});

// ─── no-domparser-html-without-sanitization ──────────────────────────────────
// Missing: isSanitizedExpression with MemberExpression callee (domparser.ts lines 54-60).
ruleTester.run(
    "no-domparser-html-without-sanitization",
    getPluginRule("no-domparser-html-without-sanitization"),
    {
        invalid: [
            // Direct unsanitized string
            {
                code: "new DOMParser().parseFromString(unsafeHtml, 'text/html');",
                errors: [{ messageId: "default" }],
            },
            // Empty string argument is also flagged - the rule has no exemption for empty string
            {
                code: "new DOMParser().parseFromString('', 'text/html');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Identifier-based sanitize call (already in baseline)
            "new DOMParser().parseFromString(sanitize(html), 'text/html');",
            // MemberExpression callee sanitize: obj.sanitize(html) - isSanitizedExpression with MemberExpression
            "new DOMParser().parseFromString(DOMPurify.sanitize(userHtml), 'text/html');",
            // Obj.purify.sanitize
            "new DOMParser().parseFromString(purify.sanitize(unsafeHtml), 'text/html');",
            // Nested member sanitize call (sanitize property)
            "new DOMParser().parseFromString(xss.sanitize(html), 'text/html');",
            // new window.DOMParser() - isDomParserParseFromStringCall requires Identifier callee name
            // "DOMParser"; window.DOMParser is a MemberExpression → returns false → not flagged
            "new window.DOMParser().parseFromString(unsafeHtml, 'text/html');",
        ],
    }
);

// ─── no-domparser-svg-without-sanitization ───────────────────────────────────
// Additional coverage for isSanitizedExpression MemberExpression path.
ruleTester.run(
    "no-domparser-svg-without-sanitization",
    getPluginRule("no-domparser-svg-without-sanitization"),
    {
        invalid: [
            {
                code: "new DOMParser().parseFromString(userSvg, 'image/svg+xml');",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Member expression sanitize
            "new DOMParser().parseFromString(DOMPurify.sanitize(userSvg), 'image/svg+xml');",
            "new DOMParser().parseFromString(svgSanitizer.sanitize(userSvg), 'image/svg+xml');",
        ],
    }
);

// ─── no-postmessage-without-origin-allowlist ─────────────────────────────────
// Additional paths: various callee types, non-postMessage methods.
ruleTester.run(
    "no-postmessage-without-origin-allowlist",
    getPluginRule("no-postmessage-without-origin-allowlist"),
    {
        invalid: [
            // With explicit '*' wildcard
            {
                code: "target.postMessage(data, '*');",
                errors: [{ messageId: "default" }],
            },
            // With variable (dynamic origin - still flagged)
            {
                code: "frame.contentWindow.postMessage(data, origin);",
                errors: [{ messageId: "default" }],
            },
            // Window.postMessage
            {
                code: "window.postMessage(data, dynamicOrigin);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Literal origin
            "target.postMessage(data, 'https://trusted.example.com');",
            // Template literal origin
            "target.postMessage(data, `https://trusted.example.com`);",
            // No second argument
            "target.postMessage(data);",
        ],
    }
);

// ─── no-cookies ──────────────────────────────────────────────────────────────
// Additional paths: window.document.cookie, bare document check.
ruleTester.run("no-cookies", getPluginRule("no-cookies"), {
    invalid: [
        // Document.cookie assignment (already in baseline)
        {
            code: "document.cookie = 'session=abc';",
            errors: [{ messageId: "doNotUseCookies" }],
        },
        // Window.document.cookie
        {
            code: "window.document.cookie = 'session=abc';",
            errors: [{ messageId: "doNotUseCookies" }],
        },
        // Reading document.cookie also triggers the rule (it uses MemberExpression selector, not AssignmentExpression)
        {
            code: "const c = document.cookie;",
            errors: [{ messageId: "doNotUseCookies" }],
        },
    ],
    valid: [
        // Not document object
        "requestCookies.cookie = 'x';",
    ],
});

// ─── no-msapp-exec-unsafe ─────────────────────────────────────────────────────
// Additional paths for MSApp (covers member expression chain).
ruleTester.run("no-msapp-exec-unsafe", getPluginRule("no-msapp-exec-unsafe"), {
    invalid: [
        {
            code: "MSApp.execUnsafeLocalFunction(function() { doSomething(); });",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        // Non-MSApp object
        "myApp.execUnsafeLocalFunction(fn);",
        // No arguments
        "MSApp.execUnsafeLocalFunction();",
    ],
});

// ─── no-html-method ──────────────────────────────────────────────────────────
// Additional tests for non-string / non-static argument.
ruleTester.run("no-html-method", getPluginRule("no-html-method"), {
    invalid: [
        // Dynamic string argument (variable) - still flagged
        {
            code: "$(selector).html(userContent);",
            errors: [{ messageId: "default" }],
        },
    ],
    valid: [
        // Non-member expression callee
        "html('content');",
        // Empty string
        "$('div').html('');",
    ],
});

// ─── no-inner-html ────────────────────────────────────────────────────────────
// Additional coverage for adjacent HTML insertion variants.
ruleTester.run("no-inner-html", getPluginRule("no-inner-html"), {
    invalid: [
        // OuterHTML assignment
        {
            code: "element.outerHTML = userContent;",
            errors: [{ messageId: "noInnerHtml" }],
        },
        // InsertAdjacentHTML with different positions
        {
            code: "element.insertAdjacentHTML('afterend', markup);",
            errors: [{ messageId: "noInsertAdjacentHTML" }],
        },
        {
            code: "element.insertAdjacentHTML('afterbegin', markup);",
            errors: [{ messageId: "noInsertAdjacentHTML" }],
        },
    ],
    valid: [
        // TextContent assignment (not innerHTML)
        "element.textContent = userContent;",
        // InsertAdjacentHTML with empty string
        "element.insertAdjacentHTML('beforebegin', '');",
    ],
});

// ─── no-range-create-contextual-fragment ─────────────────────────────────────
// Additional coverage for different callee shapes.
ruleTester.run(
    "no-range-create-contextual-fragment",
    getPluginRule("no-range-create-contextual-fragment"),
    {
        invalid: [
            // Via window.getSelection().getRangeAt(0).createContextualFragment
            {
                code: "document.createRange().createContextualFragment(markup);",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Empty string argument - no report
            "range.createContextualFragment('');",
            // Non-createContextualFragment method
            "range.createRange(markup);",
        ],
    }
);

// ─── no-electron-dangerous-blink-features ────────────────────────────────────
// Additional coverage for BrowserView and string literal vs template.
ruleTester.run(
    "no-electron-dangerous-blink-features",
    getPluginRule("no-electron-dangerous-blink-features"),
    {
        invalid: [
            // Single feature string
            {
                code: "new BrowserWindow({ webPreferences: { enableBlinkFeatures: 'ExperimentalJavaScript' } });",
                errors: [{ messageId: "default" }],
            },
            // Template literal
            {
                code: "new BrowserWindow({ webPreferences: { enableBlinkFeatures: `NetworkService` } });",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Empty string
            "new BrowserWindow({ webPreferences: { enableBlinkFeatures: '' } });",
            // Whitespace only
            "new BrowserWindow({ webPreferences: { enableBlinkFeatures: '   ' } });",
            // No enableBlinkFeatures key
            "new BrowserWindow({ webPreferences: { sandbox: true } });",
        ],
    }
);

// ─── no-message-event-without-origin-check ───────────────────────────────────
// Additional coverage for the addEventListener with different message patterns.
ruleTester.run(
    "no-message-event-without-origin-check",
    getPluginRule("no-message-event-without-origin-check"),
    {
        invalid: [
            // Destructured event without origin
            {
                code: "window.addEventListener('message', ({ data }) => { process(data); });",
                errors: [{ messageId: "default" }],
            },
            // Port message event
            {
                code: "port.onmessage = (event) => { handleData(event.data); };",
                errors: [{ messageId: "default" }],
            },
        ],
        valid: [
            // Checks event.origin
            "window.addEventListener('message', (event) => { if (event.origin !== 'https://trusted.com') return; process(event.data); });",
            // Uses origin in destructuring
            "window.addEventListener('message', ({ origin, data }) => { if (origin !== 'https://trusted.com') return; process(data); });",
        ],
    }
);
