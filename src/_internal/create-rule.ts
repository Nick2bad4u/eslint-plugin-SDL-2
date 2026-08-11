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

/**
 * Shared SDL rule helper that injects canonical docs URLs and declares that
 * every SDL rule targets ESLint's JavaScript language family. TypeScript uses
 * the same `js/js` language with a parser override.
 */
export const createRule: typeof ruleCreatorFactory = (ruleDefinition) => {
    const rule = ruleCreatorFactory(ruleDefinition);

    return {
        ...rule,
        meta: {
            ...rule.meta,
            languages: ["js/js"],
        },
    };
};
