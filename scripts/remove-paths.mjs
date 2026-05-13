import { readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

/** @param {string} value */
const expandEnvironmentVariables = (value) =>
    value.replace(/%([^%]+)%/g, (match, variableName) => {
        const resolved = process.env[variableName];

        return typeof resolved === "string" ? resolved : match;
    });

/** @param {string} value */
const normalizePattern = (value) =>
    expandEnvironmentVariables(value).replaceAll("\\", "/");

/** @param {string} targetPath */
const removePath = (targetPath) => {
    rmSync(targetPath, {
        force: true,
        recursive: true,
    });
};

/** @param {string} directoryPath */
const removeTsBuildInfoFiles = (directoryPath) => {
    /** @param {string} currentPath */
    const visit = (currentPath) => {
        let entries;

        try {
            entries = readdirSync(currentPath, { withFileTypes: true });
        } catch {
            return;
        }

        for (const entry of entries) {
            const entryPath = join(currentPath, entry.name);

            if (entry.isDirectory()) {
                visit(entryPath);
                continue;
            }

            if (entry.name.endsWith(".tsbuildinfo")) {
                removePath(entryPath);
            }
        }
    };

    visit(directoryPath);
};

for (const rawPattern of process.argv.slice(2)) {
    const normalizedPattern = normalizePattern(rawPattern);

    if (normalizedPattern.includes("/**.tsbuildinfo")) {
        const [rootDirectory] = normalizedPattern.split("/**.tsbuildinfo");

        if (rootDirectory === undefined || rootDirectory.length === 0) {
            continue;
        }

        removeTsBuildInfoFiles(resolve(process.cwd(), rootDirectory));
        continue;
    }

    if (
        normalizedPattern.endsWith("/**") ||
        normalizedPattern.endsWith("/.**")
    ) {
        const targetPath = normalizedPattern.replace(/\/(?:\.\*\*|\*\*)$/, "");

        removePath(resolve(process.cwd(), targetPath));
        continue;
    }

    removePath(resolve(process.cwd(), normalizedPattern));
}
