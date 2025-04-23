/**
 * The `logger` module provides a way to set a default logger function
 * for logging command execution details.
 *
 * @module
 */
let logger = undefined;
/**
 * Set the default logger function to write
 * commands when they are invoked.
 *
 * @param defaultLogger The logger function to use.
 * @example
 * ```typescript
 * import { setLogger } from "@hyprx/exec/set-logger";
 * setLogger(console.log);
 * ```
 */
export function setLogger(defaultLogger) {
  logger = defaultLogger;
}
/**
 * Gets the default logger function.
 * @returns The default logger function.
 */
export function getLogger() {
  return logger;
}
