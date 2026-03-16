import type { TSESLint } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";

type SdlRuleDocs = TSESLint.RuleMetaDataDocs & {
    recommended: boolean;
};

const docsBaseUrl =
    "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules";

/** Shared SDL rule helper that injects canonical docs URLs. */
export const createRule: ReturnType<
    typeof ESLintUtils.RuleCreator<SdlRuleDocs>
> = ESLintUtils.RuleCreator<SdlRuleDocs>( // eslint-disable-line total-functions/no-hidden-type-assertions -- RuleCreator must be specialized with plugin docs metadata so `meta.docs.recommended` is strongly typed.
    (name) => `${docsBaseUrl}/${name}`
);
