/**
 * Make an assertion that actual is not null or undefined.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { exists } from "@hyprxassert";
 *
 * exists("something"); // Doesn't throw
 * exists(undefined); // Throws
 * ```
 *
 * @typeParam T The type of the actual value.
 * @param actual The actual value to check.
 * @param msg The optional message to include in the error if the assertion fails.
 */
export declare function exists<T>(actual: T, msg?: string): asserts actual is NonNullable<T>;
