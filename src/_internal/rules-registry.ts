import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import noAngularBypassSanitizerRule from "../rules/no-angular-bypass-sanitizer.js";
import noAngularBypassSecurityTrustHtmlRule from "../rules/no-angular-bypass-security-trust-html.js";
import noAngularInnerhtmlBindingRule from "../rules/no-angular-innerhtml-binding.js";
import noAngularSanitizationTrustedUrlsRule from "../rules/no-angular-sanitization-trusted-urls.js";
import noAngularjsBypassSceRule from "../rules/no-angularjs-bypass-sce.js";
import noAngularjsEnableSvgRule from "../rules/no-angularjs-enable-svg.js";
import noAngularjsNgBindHtmlWithoutSanitizeRule from "../rules/no-angularjs-ng-bind-html-without-sanitize.js";
import noAngularjsSanitizationWhitelistRule from "../rules/no-angularjs-sanitization-whitelist.js";
import noAngularjsSceResourceUrlWildcardRule from "../rules/no-angularjs-sce-resource-url-wildcard.js";
import noChildProcessShellTrueRule from "../rules/no-child-process-shell-true.js";
import noCookiesRule from "../rules/no-cookies.js";
import noDocumentDomainRule from "../rules/no-document-domain.js";
import noDocumentWriteRule from "../rules/no-document-write.js";
import noDomparserHtmlWithoutSanitizationRule from "../rules/no-domparser-html-without-sanitization.js";
import noElectronAllowRunningInsecureContentRule from "../rules/no-electron-allow-running-insecure-content.js";
import noElectronDangerousBlinkFeaturesRule from "../rules/no-electron-dangerous-blink-features.js";
import noElectronDisableContextIsolationRule from "../rules/no-electron-disable-context-isolation.js";
import noElectronDisableSandboxRule from "../rules/no-electron-disable-sandbox.js";
import noElectronDisableWebSecurityRule from "../rules/no-electron-disable-web-security.js";
import noElectronEnableRemoteModuleRule from "../rules/no-electron-enable-remote-module.js";
import noElectronInsecureCertificateErrorHandlerRule from "../rules/no-electron-insecure-certificate-error-handler.js";
import noElectronInsecureCertificateVerifyProcRule from "../rules/no-electron-insecure-certificate-verify-proc.js";
import noElectronInsecurePermissionRequestHandlerRule from "../rules/no-electron-insecure-permission-request-handler.js";
import noElectronNodeIntegrationRule from "../rules/no-electron-node-integration.js";
import noElectronUncheckedIpcSenderRule from "../rules/no-electron-unchecked-ipc-sender.js";
import noElectronUnrestrictedNavigationRule from "../rules/no-electron-unrestricted-navigation.js";
import noElectronUntrustedOpenExternalRule from "../rules/no-electron-untrusted-open-external.js";
import noElectronWebviewAllowpopupsRule from "../rules/no-electron-webview-allowpopups.js";
import noElectronWebviewNodeIntegrationRule from "../rules/no-electron-webview-node-integration.js";
import noHtmlMethodRule from "../rules/no-html-method.js";
import noHttpRequestToInsecureProtocolRule from "../rules/no-http-request-to-insecure-protocol.js";
import noInnerHtmlRule from "../rules/no-inner-html.js";
import noInsecureRandomRule from "../rules/no-insecure-random.js";
import noInsecureTlsAgentOptionsRule from "../rules/no-insecure-tls-agent-options.js";
import noInsecureUrlRule from "../rules/no-insecure-url.js";
import noLocationJavascriptUrlRule from "../rules/no-location-javascript-url.js";
import noMsappExecUnsafeRule from "../rules/no-msapp-exec-unsafe.js";
import noNodeTlsRejectUnauthorizedZeroRule from "../rules/no-node-tls-reject-unauthorized-zero.js";
import noNonnullAssertionOnSecurityInputRule from "../rules/no-nonnull-assertion-on-security-input.js";
import noPostmessageStarOriginRule from "../rules/no-postmessage-star-origin.js";
import noPostmessageWithoutOriginAllowlistRule from "../rules/no-postmessage-without-origin-allowlist.js";
import noUnsafeAllocRule from "../rules/no-unsafe-alloc.js";
import noUnsafeCastToTrustedTypesRule from "../rules/no-unsafe-cast-to-trusted-types.js";
import noWindowOpenWithoutNoopenerRule from "../rules/no-window-open-without-noopener.js";
import noWinjsHtmlUnsafeRule from "../rules/no-winjs-html-unsafe.js";

export type SdlRuleModule = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

export type SdlRuleNamePattern = `no-${string}`;

export const sdlRules: Readonly<Record<SdlRuleNamePattern, SdlRuleModule>> = {
    "no-angular-bypass-sanitizer": noAngularBypassSanitizerRule,
    "no-angular-bypass-security-trust-html":
        noAngularBypassSecurityTrustHtmlRule,
    "no-angular-innerhtml-binding": noAngularInnerhtmlBindingRule,
    "no-angular-sanitization-trusted-urls":
        noAngularSanitizationTrustedUrlsRule,
    "no-angularjs-bypass-sce": noAngularjsBypassSceRule,
    "no-angularjs-enable-svg": noAngularjsEnableSvgRule,
    "no-angularjs-ng-bind-html-without-sanitize":
        noAngularjsNgBindHtmlWithoutSanitizeRule,
    "no-angularjs-sanitization-whitelist": noAngularjsSanitizationWhitelistRule,
    "no-angularjs-sce-resource-url-wildcard":
        noAngularjsSceResourceUrlWildcardRule,
    "no-child-process-shell-true": noChildProcessShellTrueRule,
    "no-cookies": noCookiesRule,
    "no-document-domain": noDocumentDomainRule,
    "no-document-write": noDocumentWriteRule,
    "no-domparser-html-without-sanitization":
        noDomparserHtmlWithoutSanitizationRule,
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
    "no-electron-insecure-certificate-verify-proc":
        noElectronInsecureCertificateVerifyProcRule,
    "no-electron-insecure-permission-request-handler":
        noElectronInsecurePermissionRequestHandlerRule,
    "no-electron-node-integration": noElectronNodeIntegrationRule,
    "no-electron-unchecked-ipc-sender": noElectronUncheckedIpcSenderRule,
    "no-electron-unrestricted-navigation": noElectronUnrestrictedNavigationRule,
    "no-electron-untrusted-open-external": noElectronUntrustedOpenExternalRule,
    "no-electron-webview-allowpopups": noElectronWebviewAllowpopupsRule,
    "no-electron-webview-node-integration":
        noElectronWebviewNodeIntegrationRule,
    "no-html-method": noHtmlMethodRule,
    "no-http-request-to-insecure-protocol": noHttpRequestToInsecureProtocolRule,
    "no-inner-html": noInnerHtmlRule,
    "no-insecure-random": noInsecureRandomRule,
    "no-insecure-tls-agent-options": noInsecureTlsAgentOptionsRule,
    "no-insecure-url": noInsecureUrlRule,
    "no-location-javascript-url": noLocationJavascriptUrlRule,
    "no-msapp-exec-unsafe": noMsappExecUnsafeRule,
    "no-node-tls-reject-unauthorized-zero": noNodeTlsRejectUnauthorizedZeroRule,
    "no-nonnull-assertion-on-security-input":
        noNonnullAssertionOnSecurityInputRule,
    "no-postmessage-star-origin": noPostmessageStarOriginRule,
    "no-postmessage-without-origin-allowlist":
        noPostmessageWithoutOriginAllowlistRule,
    "no-unsafe-alloc": noUnsafeAllocRule,
    "no-unsafe-cast-to-trusted-types": noUnsafeCastToTrustedTypesRule,
    "no-window-open-without-noopener": noWindowOpenWithoutNoopenerRule,
    "no-winjs-html-unsafe": noWinjsHtmlUnsafeRule,
};

export default sdlRules;
