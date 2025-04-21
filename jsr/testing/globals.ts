/**
 * The globals variable which is tied to `globalThis`.
 */
// deno-lint-ignore no-explicit-any
export const globals: typeof globalThis & Record<string, any> = globalThis;

let timeout: number | undefined = undefined;
if (globals.process && globals.process.env && globals.process.env["TESTING_TIMEOUT"]) {
    const t = Number.parseInt(globals.process.env["TESTING_TIMEOUT"]);
    if (!isNaN(t)) {
        timeout = t;
    }
}

/**
 * The global defaults
 */
export const defaults = {
    timeout,
};
