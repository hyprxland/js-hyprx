/**
 * The globals variable which is tied to `globalThis`.
 */
export const globals = globalThis;

let timeout = undefined;
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
