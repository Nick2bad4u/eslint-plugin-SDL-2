/** Ordered list of built-in SDL flat-config preset names. */
export const sdlConfigNames = [
    "angular",
    "angularjs",
    "common",
    "electron",
    "node",
    "react",
    "typescript",
    "required",
    "recommended",
] as const;

/** Union of supported SDL flat-config preset names. */
export type SdlConfigName = (typeof sdlConfigNames)[number];
