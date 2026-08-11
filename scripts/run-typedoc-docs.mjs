import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const typedocPackageDirectory = dirname(
    require.resolve("typedoc/package.json")
);
const typedocEntrypoint = join(typedocPackageDirectory, "bin", "typedoc");

/** @param {readonly string[]} arguments_ */
const normalizeArguments = (arguments_) => {
    /** @type {string[]} */
    const normalized = [];

    for (let index = 0; index < arguments_.length; index += 1) {
        const argument = arguments_[index];

        if (argument === undefined) {
            continue;
        }

        if (argument === "--config") {
            const configPath = arguments_[index + 1];

            if (typeof configPath === "string" && configPath.length > 0) {
                normalized.push("--options", configPath);
                index += 1;
                continue;
            }
        }

        normalized.push(argument);
    }

    return normalized;
};

const typedocArguments = normalizeArguments(process.argv.slice(2));

const runResult = spawnSync(
    process.execPath,
    [typedocEntrypoint, ...typedocArguments],
    {
        shell: false,
        stdio: "inherit",
    }
);

if (runResult.error !== undefined) {
    throw runResult.error;
}

if (typeof runResult.status === "number") {
    process.exit(runResult.status);
}

process.exit(1);
