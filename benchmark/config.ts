import { defineConfig } from "eslint-rule-benchmark";

export default defineConfig({
    iterations: 80,
    tests: [
        {
            cases: [
                {
                    testPath: "./cases/no-insecure-url/baseline.ts",
                },
                {
                    testPath: "./cases/no-insecure-url/complex.ts",
                },
            ],
            name: "Rule: no-insecure-url",
            ruleId: "sdl/no-insecure-url",
            rulePath: "../src/rules/no-insecure-url.ts",
            warmup: {
                iterations: 15,
            },
        },
    ],
    timeout: 3000,
    warmup: {
        enabled: true,
        iterations: 20,
    },
});
