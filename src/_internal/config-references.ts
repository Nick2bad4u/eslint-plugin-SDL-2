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

export type SdlConfigName = (typeof sdlConfigNames)[number];
