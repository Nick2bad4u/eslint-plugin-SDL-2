import type { TSESLint } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";

type SdlRuleDocs = TSESLint.RuleMetaDataDocs & {
    recommended: boolean;
};

const docsBaseUrl =
    "https://nick2bad4u.github.io/eslint-plugin-SDL-2/docs/rules";

/** Shared SDL rule helper that injects canonical docs URLs. */
const ruleCreatorFactory: ReturnType<
    typeof ESLintUtils.RuleCreator<SdlRuleDocs>
> =
    // eslint-disable-next-line new-cap -- RuleCreator is intentionally a callable factory.
    ESLintUtils.RuleCreator<SdlRuleDocs>((name) => `${docsBaseUrl}/${name}`);

/** Shared SDL rule helper that injects canonical docs URLs. */
export const createRule: typeof ruleCreatorFactory = ruleCreatorFactory;
