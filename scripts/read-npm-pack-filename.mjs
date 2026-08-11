import { basename, resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

/**
 * @typedef {Record<string, unknown>} UnknownRecord
 */

/**
 * @param {unknown} value
 *
 * @returns {value is UnknownRecord}
 */
const isUnknownRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Read the single tarball filename emitted by `npm pack --json`.
 *
 * Npm 11 and older emit an array of package records. npm 12 emits an object
 * keyed by package name. Both shapes are accepted, but ambiguous or unsafe
 * filenames are rejected.
 *
 * @param {unknown} packResult
 *
 * @returns {string}
 */
export const readNpmPackFilename = (packResult) => {
    /** @type {unknown[]} */
    let records;

    if (Array.isArray(packResult)) {
        records = packResult;
    } else if (isUnknownRecord(packResult)) {
        records = Object.values(packResult);
    } else {
        throw new TypeError(
            "npm pack JSON must be an array or a package-name-keyed object."
        );
    }

    if (records.length !== 1) {
        throw new TypeError(
            `Expected exactly one npm pack record, received ${records.length}.`
        );
    }

    const [record] = records;
    if (!isUnknownRecord(record)) {
        throw new TypeError("The npm pack record must be an object.");
    }

    const filename = record["filename"];
    if (typeof filename !== "string" || filename.trim().length === 0) {
        throw new TypeError(
            "The npm pack record must contain a nonblank filename."
        );
    }

    if (filename !== filename.trim() || basename(filename) !== filename) {
        throw new TypeError(
            "The npm pack filename must be a trimmed basename without path segments."
        );
    }

    return filename;
};

const isDirectRun =
    process.argv[1] !== undefined &&
    pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
    try {
        process.stdin.setEncoding("utf8");

        let input = "";
        for await (const chunk of process.stdin) {
            input += chunk;
        }

        console.log(readNpmPackFilename(JSON.parse(input)));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Unable to read npm pack filename: ${message}`);
        process.exitCode = 1;
    }
}
