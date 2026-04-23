import type { UnknownArray, UnknownRecord } from "type-fest";

import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import sdlPlugin from "../../src/plugin";

const assertRuleTesterHook: (
    candidate: unknown,
    hookName: string
) => asserts candidate is (...arguments_: UnknownArray) => unknown = (
    candidate,
    hookName
) => {
    if (typeof candidate !== "function") {
        throw new TypeError(
            `Expected Vitest hook '${hookName}' to be a function for RuleTester wiring.`
        );
    }
};

assertRuleTesterHook(afterAll, "afterAll");
RuleTester.afterAll = afterAll;
assertRuleTesterHook(describe, "describe");
RuleTester.describe = describe;
assertRuleTesterHook(it, "it");
RuleTester.it = it;
const vitestItOnly: unknown = Reflect.get(it, "only");
assertRuleTesterHook(vitestItOnly, "it.only");
RuleTester.itOnly = (
    ...arguments_: readonly [...Parameters<typeof RuleTester.itOnly>]
) => {
    Reflect.apply(vitestItOnly, undefined, arguments_);
};

type PluginRuleModule = Parameters<RuleTester["run"]>[1];

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const isRuleModule = (value: unknown): value is PluginRuleModule => {
    if (!isRecord(value)) {
        return false;
    }

    const maybeCreate = (value as { create?: unknown }).create;

    return typeof maybeCreate === "function";
};

export const createRuleTester = (): RuleTester =>
    new RuleTester({
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    });

export const getPluginRule = (ruleId: string): PluginRuleModule => {
    const dynamicRules = sdlPlugin.rules as UnknownRecord;

    if (!Object.hasOwn(dynamicRules, ruleId)) {
        throw new Error(`Rule '${ruleId}' is not registered in sdlPlugin.`);
    }

    const rule = dynamicRules[ruleId];

    if (!isRuleModule(rule)) {
        throw new TypeError(
            `Rule '${ruleId}' is not RuleTester-compatible (missing create method).`
        );
    }

    return rule;
};
