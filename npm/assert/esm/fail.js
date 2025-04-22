import { AssertionError } from "./assertion-error.js";
/**
 * Use this to assert failed test.
 *
 * @example Usage
 * ```ts no-eval
 * import { unreachable } from "@hyprxassert";
 *
 * unreachable(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @returns Never returns, always throws.
 */
export function fail(msg) {
  const msgSuffix = msg ? `: ${msg}` : ".";
  throw new AssertionError(`Failed assertion${msgSuffix}`);
}
