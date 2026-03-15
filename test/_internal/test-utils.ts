import type { Linter } from "eslint";

type TestLanguageOptions = Readonly<{
    parserOptions?: Linter.ParserOptions & Readonly<Record<string, unknown>>;
}>;

export const esModuleLanguageOptions: TestLanguageOptions = {
    parserOptions: {
        ecmaVersion: "latest" as const,
        sourceType: "module" as const,
    },
};

export const tsLanguageOptions: TestLanguageOptions = {
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
};

export const tsReactLanguageOptions: TestLanguageOptions = {
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
};
