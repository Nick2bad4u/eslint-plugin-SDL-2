import type { TSESLint } from "@typescript-eslint/utils";

import noAngularBypassSanitizerRule from "../rules/no-angular-bypass-sanitizer.js";
import noAngularSanitizationTrustedUrlsRule from "../rules/no-angular-sanitization-trusted-urls.js";
import noAngularjsBypassSceRule from "../rules/no-angularjs-bypass-sce.js";
import noAngularjsEnableSvgRule from "../rules/no-angularjs-enable-svg.js";
import noAngularjsSanitizationWhitelistRule from "../rules/no-angularjs-sanitization-whitelist.js";
import noCookiesRule from "../rules/no-cookies.js";
import noDocumentDomainRule from "../rules/no-document-domain.js";
import noDocumentWriteRule from "../rules/no-document-write.js";
import noElectronNodeIntegrationRule from "../rules/no-electron-node-integration.js";
import noHtmlMethodRule from "../rules/no-html-method.js";
import noInnerHtmlRule from "../rules/no-inner-html.js";
import noInsecureRandomRule from "../rules/no-insecure-random.js";
import noInsecureUrlRule from "../rules/no-insecure-url.js";
import noMsappExecUnsafeRule from "../rules/no-msapp-exec-unsafe.js";
import noPostmessageStarOriginRule from "../rules/no-postmessage-star-origin.js";
import noUnsafeAllocRule from "../rules/no-unsafe-alloc.js";
import noWinjsHtmlUnsafeRule from "../rules/no-winjs-html-unsafe.js";

export type SdlRuleModule = TSESLint.RuleModule<string, unknown[]>;

export type SdlRuleNamePattern = `no-${string}`;

export const sdlRules: Readonly<Record<SdlRuleNamePattern, SdlRuleModule>> = {
    "no-angular-bypass-sanitizer": noAngularBypassSanitizerRule,
    "no-angular-sanitization-trusted-urls":
        noAngularSanitizationTrustedUrlsRule,
    "no-angularjs-bypass-sce": noAngularjsBypassSceRule,
    "no-angularjs-enable-svg": noAngularjsEnableSvgRule,
    "no-angularjs-sanitization-whitelist": noAngularjsSanitizationWhitelistRule,
    "no-cookies": noCookiesRule,
    "no-document-domain": noDocumentDomainRule,
    "no-document-write": noDocumentWriteRule,
    "no-electron-node-integration": noElectronNodeIntegrationRule,
    "no-html-method": noHtmlMethodRule,
    "no-inner-html": noInnerHtmlRule,
    "no-insecure-random": noInsecureRandomRule,
    "no-insecure-url": noInsecureUrlRule,
    "no-msapp-exec-unsafe": noMsappExecUnsafeRule,
    "no-postmessage-star-origin": noPostmessageStarOriginRule,
    "no-unsafe-alloc": noUnsafeAllocRule,
    "no-winjs-html-unsafe": noWinjsHtmlUnsafeRule,
};

export default sdlRules;
