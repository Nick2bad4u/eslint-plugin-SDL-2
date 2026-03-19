/* eslint-disable canonical/no-re-export -- Rule registry intentionally aggregates imported rule modules into a single exported map. */
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
import noChildProcessExecRule from "../rules/no-child-process-exec.js";
import noChildProcessShellTrueRule from "../rules/no-child-process-shell-true.js";
import noCookiesRule from "../rules/no-cookies.js";
import noDocumentDomainRule from "../rules/no-document-domain.js";
import noDocumentExeccommandInsertHtmlRule from "../rules/no-document-execcommand-insert-html.js";
import noDocumentParseHtmlUnsafeRule from "../rules/no-document-parse-html-unsafe.js";
import noDocumentWriteRule from "../rules/no-document-write.js";
import noDomparserHtmlWithoutSanitizationRule from "../rules/no-domparser-html-without-sanitization.js";
import noDomparserSvgWithoutSanitizationRule from "../rules/no-domparser-svg-without-sanitization.js";
import noDynamicImportUnsafeUrlRule from "../rules/no-dynamic-import-unsafe-url.js";
import noElectronAllowRunningInsecureContentRule from "../rules/no-electron-allow-running-insecure-content.js";
import noElectronDangerousBlinkFeaturesRule from "../rules/no-electron-dangerous-blink-features.js";
import noElectronDisableContextIsolationRule from "../rules/no-electron-disable-context-isolation.js";
import noElectronDisableSandboxRule from "../rules/no-electron-disable-sandbox.js";
import noElectronDisableWebSecurityRule from "../rules/no-electron-disable-web-security.js";
import noElectronEnableRemoteModuleRule from "../rules/no-electron-enable-remote-module.js";
import noElectronEnableWebviewTagRule from "../rules/no-electron-enable-webview-tag.js";
import noElectronExperimentalFeaturesRule from "../rules/no-electron-experimental-features.js";
import noElectronExposeRawIpcRendererRule from "../rules/no-electron-expose-raw-ipc-renderer.js";
import noElectronInsecureCertificateErrorHandlerRule from "../rules/no-electron-insecure-certificate-error-handler.js";
import noElectronInsecureCertificateVerifyProcRule from "../rules/no-electron-insecure-certificate-verify-proc.js";
import noElectronInsecurePermissionRequestHandlerRule from "../rules/no-electron-insecure-permission-request-handler.js";
import noElectronNodeIntegrationRule from "../rules/no-electron-node-integration.js";
import noElectronPermissionCheckHandlerAllowAllRule from "../rules/no-electron-permission-check-handler-allow-all.js";
import noElectronUncheckedIpcSenderRule from "../rules/no-electron-unchecked-ipc-sender.js";
import noElectronUnrestrictedNavigationRule from "../rules/no-electron-unrestricted-navigation.js";
import noElectronUntrustedOpenExternalRule from "../rules/no-electron-untrusted-open-external.js";
import noElectronWebviewAllowpopupsRule from "../rules/no-electron-webview-allowpopups.js";
import noElectronWebviewInsecureWebpreferencesRule from "../rules/no-electron-webview-insecure-webpreferences.js";
import noElectronWebviewNodeIntegrationRule from "../rules/no-electron-webview-node-integration.js";
import noHtmlMethodRule from "../rules/no-html-method.js";
import noHttpRequestToInsecureProtocolRule from "../rules/no-http-request-to-insecure-protocol.js";
import noIframeSrcdocRule from "../rules/no-iframe-srcdoc.js";
import noInnerHtmlRule from "../rules/no-inner-html.js";
import noInsecureRandomRule from "../rules/no-insecure-random.js";
import noInsecureTlsAgentOptionsRule from "../rules/no-insecure-tls-agent-options.js";
import noInsecureUrlRule from "../rules/no-insecure-url.js";
import noLocationJavascriptUrlRule from "../rules/no-location-javascript-url.js";
import noMessageEventWithoutOriginCheckRule from "../rules/no-message-event-without-origin-check.js";
import noMsappExecUnsafeRule from "../rules/no-msapp-exec-unsafe.js";
import noNodeTlsCheckServerIdentityBypassRule from "../rules/no-node-tls-check-server-identity-bypass.js";
import noNodeTlsLegacyProtocolRule from "../rules/no-node-tls-legacy-protocol.js";
import noNodeTlsRejectUnauthorizedZeroRule from "../rules/no-node-tls-reject-unauthorized-zero.js";
import noNodeTlsSecurityLevelZeroRule from "../rules/no-node-tls-security-level-zero.js";
import noNodeVmRunInContextRule from "../rules/no-node-vm-run-in-context.js";
import noNodeVmSourceTextModuleRule from "../rules/no-node-vm-source-text-module.js";
import noNodeWorkerThreadsEvalRule from "../rules/no-node-worker-threads-eval.js";
import noNonnullAssertionOnSecurityInputRule from "../rules/no-nonnull-assertion-on-security-input.js";
import noPostmessageStarOriginRule from "../rules/no-postmessage-star-origin.js";
import noPostmessageWithoutOriginAllowlistRule from "../rules/no-postmessage-without-origin-allowlist.js";
import noRangeCreateContextualFragmentRule from "../rules/no-range-create-contextual-fragment.js";
import noScriptSrcDataUrlRule from "../rules/no-script-src-data-url.js";
import noScriptTextRule from "../rules/no-script-text.js";
import noServiceWorkerUnsafeScriptUrlRule from "../rules/no-service-worker-unsafe-script-url.js";
import noSetHtmlUnsafeRule from "../rules/no-set-html-unsafe.js";
import noTrustedTypesPolicyPassThroughRule from "../rules/no-trusted-types-policy-pass-through.js";
import noUnsafeAllocRule from "../rules/no-unsafe-alloc.js";
import noUnsafeCastToTrustedTypesRule from "../rules/no-unsafe-cast-to-trusted-types.js";
import noWindowOpenWithoutNoopenerRule from "../rules/no-window-open-without-noopener.js";
import noWinjsHtmlUnsafeRule from "../rules/no-winjs-html-unsafe.js";
import noWorkerBlobUrlRule from "../rules/no-worker-blob-url.js";
import noWorkerDataUrlRule from "../rules/no-worker-data-url.js";

/** Canonical SDL rule module type used in the exported registry map. */
export type SdlRuleModule = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

/** Naming convention for SDL security rule identifiers. */
export type SdlRuleNamePattern = `no-${string}`;

/** SDL rule registry keyed by rule name for plugin export wiring. */
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
    "no-child-process-exec": noChildProcessExecRule,
    "no-child-process-shell-true": noChildProcessShellTrueRule,
    "no-cookies": noCookiesRule,
    "no-document-domain": noDocumentDomainRule,
    "no-document-execcommand-insert-html": noDocumentExeccommandInsertHtmlRule,
    "no-document-parse-html-unsafe": noDocumentParseHtmlUnsafeRule,
    "no-document-write": noDocumentWriteRule,
    "no-domparser-html-without-sanitization":
        noDomparserHtmlWithoutSanitizationRule,
    "no-domparser-svg-without-sanitization":
        noDomparserSvgWithoutSanitizationRule,
    "no-dynamic-import-unsafe-url": noDynamicImportUnsafeUrlRule,
    "no-electron-allow-running-insecure-content":
        noElectronAllowRunningInsecureContentRule,
    "no-electron-dangerous-blink-features":
        noElectronDangerousBlinkFeaturesRule,
    "no-electron-disable-context-isolation":
        noElectronDisableContextIsolationRule,
    "no-electron-disable-sandbox": noElectronDisableSandboxRule,
    "no-electron-disable-web-security": noElectronDisableWebSecurityRule,
    "no-electron-enable-remote-module": noElectronEnableRemoteModuleRule,
    "no-electron-enable-webview-tag": noElectronEnableWebviewTagRule,
    "no-electron-experimental-features": noElectronExperimentalFeaturesRule,
    "no-electron-expose-raw-ipc-renderer": noElectronExposeRawIpcRendererRule,
    "no-electron-insecure-certificate-error-handler":
        noElectronInsecureCertificateErrorHandlerRule,
    "no-electron-insecure-certificate-verify-proc":
        noElectronInsecureCertificateVerifyProcRule,
    "no-electron-insecure-permission-request-handler":
        noElectronInsecurePermissionRequestHandlerRule,
    "no-electron-node-integration": noElectronNodeIntegrationRule,
    "no-electron-permission-check-handler-allow-all":
        noElectronPermissionCheckHandlerAllowAllRule,
    "no-electron-unchecked-ipc-sender": noElectronUncheckedIpcSenderRule,
    "no-electron-unrestricted-navigation": noElectronUnrestrictedNavigationRule,
    "no-electron-untrusted-open-external": noElectronUntrustedOpenExternalRule,
    "no-electron-webview-allowpopups": noElectronWebviewAllowpopupsRule,
    "no-electron-webview-insecure-webpreferences":
        noElectronWebviewInsecureWebpreferencesRule,
    "no-electron-webview-node-integration":
        noElectronWebviewNodeIntegrationRule,
    "no-html-method": noHtmlMethodRule,
    "no-http-request-to-insecure-protocol": noHttpRequestToInsecureProtocolRule,
    "no-iframe-srcdoc": noIframeSrcdocRule,
    "no-inner-html": noInnerHtmlRule,
    "no-insecure-random": noInsecureRandomRule,
    "no-insecure-tls-agent-options": noInsecureTlsAgentOptionsRule,
    "no-insecure-url": noInsecureUrlRule,
    "no-location-javascript-url": noLocationJavascriptUrlRule,
    "no-message-event-without-origin-check":
        noMessageEventWithoutOriginCheckRule,
    "no-msapp-exec-unsafe": noMsappExecUnsafeRule,
    "no-node-tls-check-server-identity-bypass":
        noNodeTlsCheckServerIdentityBypassRule,
    "no-node-tls-legacy-protocol": noNodeTlsLegacyProtocolRule,
    "no-node-tls-reject-unauthorized-zero": noNodeTlsRejectUnauthorizedZeroRule,
    "no-node-tls-security-level-zero": noNodeTlsSecurityLevelZeroRule,
    "no-node-vm-run-in-context": noNodeVmRunInContextRule,
    "no-node-vm-source-text-module": noNodeVmSourceTextModuleRule,
    "no-node-worker-threads-eval": noNodeWorkerThreadsEvalRule,
    "no-nonnull-assertion-on-security-input":
        noNonnullAssertionOnSecurityInputRule,
    "no-postmessage-star-origin": noPostmessageStarOriginRule,
    "no-postmessage-without-origin-allowlist":
        noPostmessageWithoutOriginAllowlistRule,
    "no-range-create-contextual-fragment": noRangeCreateContextualFragmentRule,
    "no-script-src-data-url": noScriptSrcDataUrlRule,
    "no-script-text": noScriptTextRule,
    "no-service-worker-unsafe-script-url": noServiceWorkerUnsafeScriptUrlRule,
    "no-set-html-unsafe": noSetHtmlUnsafeRule,
    "no-trusted-types-policy-pass-through": noTrustedTypesPolicyPassThroughRule,
    "no-unsafe-alloc": noUnsafeAllocRule,
    "no-unsafe-cast-to-trusted-types": noUnsafeCastToTrustedTypesRule,
    "no-window-open-without-noopener": noWindowOpenWithoutNoopenerRule,
    "no-winjs-html-unsafe": noWinjsHtmlUnsafeRule,
    "no-worker-blob-url": noWorkerBlobUrlRule,
    "no-worker-data-url": noWorkerDataUrlRule,
};

export default sdlRules;
/* eslint-enable canonical/no-re-export -- End of intentional registry aggregation. */
