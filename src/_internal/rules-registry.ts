import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import * as noAngularBypassSanitizerRuleModule from "../rules/no-angular-bypass-sanitizer.js";
import * as noAngularBypassSecurityTrustHtmlRuleModule from "../rules/no-angular-bypass-security-trust-html.js";
import * as noAngularInnerhtmlBindingRuleModule from "../rules/no-angular-innerhtml-binding.js";
import * as noAngularSanitizationTrustedUrlsRuleModule from "../rules/no-angular-sanitization-trusted-urls.js";
import * as noAngularjsBypassSceRuleModule from "../rules/no-angularjs-bypass-sce.js";
import * as noAngularjsEnableSvgRuleModule from "../rules/no-angularjs-enable-svg.js";
import * as noAngularjsNgBindHtmlWithoutSanitizeRuleModule from "../rules/no-angularjs-ng-bind-html-without-sanitize.js";
import * as noAngularjsSanitizationWhitelistRuleModule from "../rules/no-angularjs-sanitization-whitelist.js";
import * as noAngularjsSceResourceUrlWildcardRuleModule from "../rules/no-angularjs-sce-resource-url-wildcard.js";
import * as noChildProcessExecRuleModule from "../rules/no-child-process-exec.js";
import * as noChildProcessShellTrueRuleModule from "../rules/no-child-process-shell-true.js";
import * as noCookiesRuleModule from "../rules/no-cookies.js";
import * as noDocumentDomainRuleModule from "../rules/no-document-domain.js";
import * as noDocumentExeccommandInsertHtmlRuleModule from "../rules/no-document-execcommand-insert-html.js";
import * as noDocumentParseHtmlUnsafeRuleModule from "../rules/no-document-parse-html-unsafe.js";
import * as noDocumentWriteRuleModule from "../rules/no-document-write.js";
import * as noDomparserHtmlWithoutSanitizationRuleModule from "../rules/no-domparser-html-without-sanitization.js";
import * as noDomparserSvgWithoutSanitizationRuleModule from "../rules/no-domparser-svg-without-sanitization.js";
import * as noDynamicImportUnsafeUrlRuleModule from "../rules/no-dynamic-import-unsafe-url.js";
import * as noElectronAllowRunningInsecureContentRuleModule from "../rules/no-electron-allow-running-insecure-content.js";
import * as noElectronDangerousBlinkFeaturesRuleModule from "../rules/no-electron-dangerous-blink-features.js";
import * as noElectronDisableContextIsolationRuleModule from "../rules/no-electron-disable-context-isolation.js";
import * as noElectronDisableSandboxRuleModule from "../rules/no-electron-disable-sandbox.js";
import * as noElectronDisableWebSecurityRuleModule from "../rules/no-electron-disable-web-security.js";
import * as noElectronEnableRemoteModuleRuleModule from "../rules/no-electron-enable-remote-module.js";
import * as noElectronEnableWebviewTagRuleModule from "../rules/no-electron-enable-webview-tag.js";
import * as noElectronExperimentalFeaturesRuleModule from "../rules/no-electron-experimental-features.js";
import * as noElectronExposeRawIpcRendererRuleModule from "../rules/no-electron-expose-raw-ipc-renderer.js";
import * as noElectronInsecureCertificateErrorHandlerRuleModule from "../rules/no-electron-insecure-certificate-error-handler.js";
import * as noElectronInsecureCertificateVerifyProcRuleModule from "../rules/no-electron-insecure-certificate-verify-proc.js";
import * as noElectronInsecurePermissionRequestHandlerRuleModule from "../rules/no-electron-insecure-permission-request-handler.js";
import * as noElectronNodeIntegrationRuleModule from "../rules/no-electron-node-integration.js";
import * as noElectronPermissionCheckHandlerAllowAllRuleModule from "../rules/no-electron-permission-check-handler-allow-all.js";
import * as noElectronUncheckedIpcSenderRuleModule from "../rules/no-electron-unchecked-ipc-sender.js";
import * as noElectronUnrestrictedNavigationRuleModule from "../rules/no-electron-unrestricted-navigation.js";
import * as noElectronUntrustedOpenExternalRuleModule from "../rules/no-electron-untrusted-open-external.js";
import * as noElectronWebviewAllowpopupsRuleModule from "../rules/no-electron-webview-allowpopups.js";
import * as noElectronWebviewInsecureWebpreferencesRuleModule from "../rules/no-electron-webview-insecure-webpreferences.js";
import * as noElectronWebviewNodeIntegrationRuleModule from "../rules/no-electron-webview-node-integration.js";
import * as noHtmlMethodRuleModule from "../rules/no-html-method.js";
import * as noHttpRequestToInsecureProtocolRuleModule from "../rules/no-http-request-to-insecure-protocol.js";
import * as noIframeSrcdocRuleModule from "../rules/no-iframe-srcdoc.js";
import * as noInnerHtmlRuleModule from "../rules/no-inner-html.js";
import * as noInsecureRandomRuleModule from "../rules/no-insecure-random.js";
import * as noInsecureTlsAgentOptionsRuleModule from "../rules/no-insecure-tls-agent-options.js";
import * as noInsecureUrlRuleModule from "../rules/no-insecure-url.js";
import * as noLocationJavascriptUrlRuleModule from "../rules/no-location-javascript-url.js";
import * as noMessageEventWithoutOriginCheckRuleModule from "../rules/no-message-event-without-origin-check.js";
import * as noMsappExecUnsafeRuleModule from "../rules/no-msapp-exec-unsafe.js";
import * as noNodeTlsCheckServerIdentityBypassRuleModule from "../rules/no-node-tls-check-server-identity-bypass.js";
import * as noNodeTlsLegacyProtocolRuleModule from "../rules/no-node-tls-legacy-protocol.js";
import * as noNodeTlsRejectUnauthorizedZeroRuleModule from "../rules/no-node-tls-reject-unauthorized-zero.js";
import * as noNodeTlsSecurityLevelZeroRuleModule from "../rules/no-node-tls-security-level-zero.js";
import * as noNodeVmRunInContextRuleModule from "../rules/no-node-vm-run-in-context.js";
import * as noNodeVmSourceTextModuleRuleModule from "../rules/no-node-vm-source-text-module.js";
import * as noNodeWorkerThreadsEvalRuleModule from "../rules/no-node-worker-threads-eval.js";
import * as noNonnullAssertionOnSecurityInputRuleModule from "../rules/no-nonnull-assertion-on-security-input.js";
import * as noPostmessageStarOriginRuleModule from "../rules/no-postmessage-star-origin.js";
import * as noPostmessageWithoutOriginAllowlistRuleModule from "../rules/no-postmessage-without-origin-allowlist.js";
import * as noRangeCreateContextualFragmentRuleModule from "../rules/no-range-create-contextual-fragment.js";
import * as noScriptSrcDataUrlRuleModule from "../rules/no-script-src-data-url.js";
import * as noScriptTextRuleModule from "../rules/no-script-text.js";
import * as noServiceWorkerUnsafeScriptUrlRuleModule from "../rules/no-service-worker-unsafe-script-url.js";
import * as noSetHtmlUnsafeRuleModule from "../rules/no-set-html-unsafe.js";
import * as noTrustedTypesPolicyPassThroughRuleModule from "../rules/no-trusted-types-policy-pass-through.js";
import * as noUnsafeAllocRuleModule from "../rules/no-unsafe-alloc.js";
import * as noUnsafeCastToTrustedTypesRuleModule from "../rules/no-unsafe-cast-to-trusted-types.js";
import * as noWindowOpenWithoutNoopenerRuleModule from "../rules/no-window-open-without-noopener.js";
import * as noWinjsHtmlUnsafeRuleModule from "../rules/no-winjs-html-unsafe.js";
import * as noWorkerBlobUrlRuleModule from "../rules/no-worker-blob-url.js";
import * as noWorkerDataUrlRuleModule from "../rules/no-worker-data-url.js";

/** Canonical SDL rule module type used in the exported registry map. */
export type SdlRuleModule = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

/** Naming convention for SDL security rule identifiers. */
export type SdlRuleNamePattern = `no-${string}`;

/** SDL rule registry keyed by rule name for plugin export wiring. */
export const sdlRules: Readonly<Record<SdlRuleNamePattern, SdlRuleModule>> = {
    "no-angular-bypass-sanitizer": noAngularBypassSanitizerRuleModule.default,
    "no-angular-bypass-security-trust-html":
        noAngularBypassSecurityTrustHtmlRuleModule.default,
    "no-angular-innerhtml-binding": noAngularInnerhtmlBindingRuleModule.default,
    "no-angular-sanitization-trusted-urls":
        noAngularSanitizationTrustedUrlsRuleModule.default,
    "no-angularjs-bypass-sce": noAngularjsBypassSceRuleModule.default,
    "no-angularjs-enable-svg": noAngularjsEnableSvgRuleModule.default,
    "no-angularjs-ng-bind-html-without-sanitize":
        noAngularjsNgBindHtmlWithoutSanitizeRuleModule.default,
    "no-angularjs-sanitization-whitelist":
        noAngularjsSanitizationWhitelistRuleModule.default,
    "no-angularjs-sce-resource-url-wildcard":
        noAngularjsSceResourceUrlWildcardRuleModule.default,
    "no-child-process-exec": noChildProcessExecRuleModule.default,
    "no-child-process-shell-true": noChildProcessShellTrueRuleModule.default,
    "no-cookies": noCookiesRuleModule.default,
    "no-document-domain": noDocumentDomainRuleModule.default,
    "no-document-execcommand-insert-html":
        noDocumentExeccommandInsertHtmlRuleModule.default,
    "no-document-parse-html-unsafe":
        noDocumentParseHtmlUnsafeRuleModule.default,
    "no-document-write": noDocumentWriteRuleModule.default,
    "no-domparser-html-without-sanitization":
        noDomparserHtmlWithoutSanitizationRuleModule.default,
    "no-domparser-svg-without-sanitization":
        noDomparserSvgWithoutSanitizationRuleModule.default,
    "no-dynamic-import-unsafe-url": noDynamicImportUnsafeUrlRuleModule.default,
    "no-electron-allow-running-insecure-content":
        noElectronAllowRunningInsecureContentRuleModule.default,
    "no-electron-dangerous-blink-features":
        noElectronDangerousBlinkFeaturesRuleModule.default,
    "no-electron-disable-context-isolation":
        noElectronDisableContextIsolationRuleModule.default,
    "no-electron-disable-sandbox": noElectronDisableSandboxRuleModule.default,
    "no-electron-disable-web-security":
        noElectronDisableWebSecurityRuleModule.default,
    "no-electron-enable-remote-module":
        noElectronEnableRemoteModuleRuleModule.default,
    "no-electron-enable-webview-tag":
        noElectronEnableWebviewTagRuleModule.default,
    "no-electron-experimental-features":
        noElectronExperimentalFeaturesRuleModule.default,
    "no-electron-expose-raw-ipc-renderer":
        noElectronExposeRawIpcRendererRuleModule.default,
    "no-electron-insecure-certificate-error-handler":
        noElectronInsecureCertificateErrorHandlerRuleModule.default,
    "no-electron-insecure-certificate-verify-proc":
        noElectronInsecureCertificateVerifyProcRuleModule.default,
    "no-electron-insecure-permission-request-handler":
        noElectronInsecurePermissionRequestHandlerRuleModule.default,
    "no-electron-node-integration": noElectronNodeIntegrationRuleModule.default,
    "no-electron-permission-check-handler-allow-all":
        noElectronPermissionCheckHandlerAllowAllRuleModule.default,
    "no-electron-unchecked-ipc-sender":
        noElectronUncheckedIpcSenderRuleModule.default,
    "no-electron-unrestricted-navigation":
        noElectronUnrestrictedNavigationRuleModule.default,
    "no-electron-untrusted-open-external":
        noElectronUntrustedOpenExternalRuleModule.default,
    "no-electron-webview-allowpopups":
        noElectronWebviewAllowpopupsRuleModule.default,
    "no-electron-webview-insecure-webpreferences":
        noElectronWebviewInsecureWebpreferencesRuleModule.default,
    "no-electron-webview-node-integration":
        noElectronWebviewNodeIntegrationRuleModule.default,
    "no-html-method": noHtmlMethodRuleModule.default,
    "no-http-request-to-insecure-protocol":
        noHttpRequestToInsecureProtocolRuleModule.default,
    "no-iframe-srcdoc": noIframeSrcdocRuleModule.default,
    "no-inner-html": noInnerHtmlRuleModule.default,
    "no-insecure-random": noInsecureRandomRuleModule.default,
    "no-insecure-tls-agent-options":
        noInsecureTlsAgentOptionsRuleModule.default,
    "no-insecure-url": noInsecureUrlRuleModule.default,
    "no-location-javascript-url": noLocationJavascriptUrlRuleModule.default,
    "no-message-event-without-origin-check":
        noMessageEventWithoutOriginCheckRuleModule.default,
    "no-msapp-exec-unsafe": noMsappExecUnsafeRuleModule.default,
    "no-node-tls-check-server-identity-bypass":
        noNodeTlsCheckServerIdentityBypassRuleModule.default,
    "no-node-tls-legacy-protocol": noNodeTlsLegacyProtocolRuleModule.default,
    "no-node-tls-reject-unauthorized-zero":
        noNodeTlsRejectUnauthorizedZeroRuleModule.default,
    "no-node-tls-security-level-zero":
        noNodeTlsSecurityLevelZeroRuleModule.default,
    "no-node-vm-run-in-context": noNodeVmRunInContextRuleModule.default,
    "no-node-vm-source-text-module": noNodeVmSourceTextModuleRuleModule.default,
    "no-node-worker-threads-eval": noNodeWorkerThreadsEvalRuleModule.default,
    "no-nonnull-assertion-on-security-input":
        noNonnullAssertionOnSecurityInputRuleModule.default,
    "no-postmessage-star-origin": noPostmessageStarOriginRuleModule.default,
    "no-postmessage-without-origin-allowlist":
        noPostmessageWithoutOriginAllowlistRuleModule.default,
    "no-range-create-contextual-fragment":
        noRangeCreateContextualFragmentRuleModule.default,
    "no-script-src-data-url": noScriptSrcDataUrlRuleModule.default,
    "no-script-text": noScriptTextRuleModule.default,
    "no-service-worker-unsafe-script-url":
        noServiceWorkerUnsafeScriptUrlRuleModule.default,
    "no-set-html-unsafe": noSetHtmlUnsafeRuleModule.default,
    "no-trusted-types-policy-pass-through":
        noTrustedTypesPolicyPassThroughRuleModule.default,
    "no-unsafe-alloc": noUnsafeAllocRuleModule.default,
    "no-unsafe-cast-to-trusted-types":
        noUnsafeCastToTrustedTypesRuleModule.default,
    "no-window-open-without-noopener":
        noWindowOpenWithoutNoopenerRuleModule.default,
    "no-winjs-html-unsafe": noWinjsHtmlUnsafeRuleModule.default,
    "no-worker-blob-url": noWorkerBlobUrlRuleModule.default,
    "no-worker-data-url": noWorkerDataUrlRuleModule.default,
};

export default sdlRules;
