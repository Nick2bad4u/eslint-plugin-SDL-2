import { ESLintUtils } from "@typescript-eslint/utils";

const docsBaseUrl =
    "https://nick2bad4u.github.io/eslint-plugin-sdl-2/docs/rules";

/** Shared SDL rule helper that injects canonical docs URLs. */
export const createRule: ReturnType<typeof ESLintUtils.RuleCreator> =
    ESLintUtils.RuleCreator((name) => `${docsBaseUrl}/${name}`);
