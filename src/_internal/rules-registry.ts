import type { TSESLint } from "@typescript-eslint/utils";

import noAngularBypassSanitizerRule from "../rules/no-angular-bypass-sanitizer.js";
import noAngularSanitizationTrustedUrlsRule from "../rules/no-angular-sanitization-trusted-urls.js";
import noAngularjsBypassSceRule from "../rules/no-angularjs-bypass-sce.js";
import noAngularjsEnableSvgRule from "../rules/no-angularjs-enable-svg.js";
import noAngularjsSanitizationWhitelistRule from "../rules/no-angularjs-sanitization-whitelist.js";
import noCookiesRule from "../rules/no-cookies.js";
import noDocumentDomainRule from "../rules/no-document-domain.js";
import noDocumentWriteRule from "../rules/no-document-write.js";
import noElectronAllowRunningInsecureContentRule from "../rules/no-electron-allow-running-insecure-content.js";
import noElectronDangerousBlinkFeaturesRule from "../rules/no-electron-dangerous-blink-features.js";
import noElectronDisableContextIsolationRule from "../rules/no-electron-disable-context-isolation.js";
import noElectronDisableSandboxRule from "../rules/no-electron-disable-sandbox.js";
import noElectronDisableWebSecurityRule from "../rules/no-electron-disable-web-security.js";
import noElectronEnableRemoteModuleRule from "../rules/no-electron-enable-remote-module.js";
import noElectronInsecureCertificateErrorHandlerRule from "../rules/no-electron-insecure-certificate-error-handler.js";
import noElectronNodeIntegrationRule from "../rules/no-electron-node-integration.js";
import noElectronUntrustedOpenExternalRule from "../rules/no-electron-untrusted-open-external.js";
import noHtmlMethodRule from "../rules/no-html-method.js";
import noInnerHtmlRule from "../rules/no-inner-html.js";
import noInsecureRandomRule from "../rules/no-insecure-random.js";
import noInsecureUrlRule from "../rules/no-insecure-url.js";
import noMsappExecUnsafeRule from "../rules/no-msapp-exec-unsafe.js";
import noNodeTlsRejectUnauthorizedZeroRule from "../rules/no-node-tls-reject-unauthorized-zero.js";
import noPostmessageStarOriginRule from "../rules/no-postmessage-star-origin.js";
import noUnsafeAllocRule from "../rules/no-unsafe-alloc.js";
import noWindowOpenWithoutNoopenerRule from "../rules/no-window-open-without-noopener.js";
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
    "no-electron-allow-running-insecure-content":
        noElectronAllowRunningInsecureContentRule,
    "no-electron-dangerous-blink-features":
        noElectronDangerousBlinkFeaturesRule,
    "no-electron-disable-context-isolation":
        noElectronDisableContextIsolationRule,
    "no-electron-disable-sandbox": noElectronDisableSandboxRule,
    "no-electron-disable-web-security": noElectronDisableWebSecurityRule,
    "no-electron-enable-remote-module": noElectronEnableRemoteModuleRule,
    "no-electron-insecure-certificate-error-handler":
        noElectronInsecureCertificateErrorHandlerRule,
    "no-electron-node-integration": noElectronNodeIntegrationRule,
    "no-electron-untrusted-open-external": noElectronUntrustedOpenExternalRule,
    "no-html-method": noHtmlMethodRule,
    "no-inner-html": noInnerHtmlRule,
    "no-insecure-random": noInsecureRandomRule,
    "no-insecure-url": noInsecureUrlRule,
    "no-msapp-exec-unsafe": noMsappExecUnsafeRule,
    "no-node-tls-reject-unauthorized-zero": noNodeTlsRejectUnauthorizedZeroRule,
    "no-postmessage-star-origin": noPostmessageStarOriginRule,
    "no-unsafe-alloc": noUnsafeAllocRule,
    "no-window-open-without-noopener": noWindowOpenWithoutNoopenerRule,
    "no-winjs-html-unsafe": noWinjsHtmlUnsafeRule,
};

export default sdlRules;
