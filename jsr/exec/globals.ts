import { DARWIN, globals, WINDOWS } from "@hyprx/runtime-info";
export { DARWIN, globals, WINDOWS };

export const WIN = WINDOWS;

export function loadChildProcess(): typeof import("node:child_process") | undefined {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule(
            "node:child_process",
        ) as typeof import("node:child_process");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:child_process") as typeof import("node:child_process");
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}
