import { globals, WINDOWS } from "@hyprx/runtime-info";

export { globals, WINDOWS };

/**
 * @internal
 */
export const WIN = WINDOWS;

export function loadFs(): typeof import("node:fs") | undefined {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule("node:fs") as typeof import("node:fs");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:fs") as typeof import("node:fs");
        } catch (_) {
            // Ignore error
        }
    }

    console.log("require", globals.require);

    return undefined;
}

export function loadFsAsync(): typeof import("node:fs/promises") | undefined {
    if (globals.Bun) {
        console.log("bun", true);
        console.log(globals.require);
    }
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule(
            "node:fs/promises",
        ) as typeof import("node:fs/promises");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:fs/promises") as typeof import("node:fs/promises");
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}
