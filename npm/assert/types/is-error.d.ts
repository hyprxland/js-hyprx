/**
 * Make an assertion that `error` is an `Error`.
 * If not then an error will be thrown.
 * An error class and a string that should be included in the
 * error message can also be asserted.
 *
 * @example Usage
 * ```ts no-eval
 * import { isError } from "@hyprxassert";
 *
 * isError(null); // Throws
 * isError(new RangeError("Out of range")); // Doesn't throw
 * isError(new RangeError("Out of range"), SyntaxError); // Throws
 * isError(new RangeError("Out of range"), SyntaxError, "Out of range"); // Doesn't throw
 * isError(new RangeError("Out of range"), SyntaxError, "Within range"); // Throws
 * ```
 *
 * @typeParam E The type of the error to assert.
 * @param error The error to assert.
 * @param ErrorClass The optional error class to assert.
 * @param msgMatches The optional string or RegExp to assert in the error message.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function isError<E extends Error = Error>(
  error: unknown,
  ErrorClass?: abstract new (...args: any[]) => E,
  msgMatches?: string | RegExp,
  msg?: string,
): asserts error is E;
