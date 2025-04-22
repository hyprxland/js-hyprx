/**
 * Make an assertion that `actual` and `expected` are strictly equal, using
 * {@linkcode Object.is} for equality comparison. If not, then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { strictEquals } from "@hyprxassert";
 *
 * const a = {};
 * const b = a;
 * strictEquals(a, b); // Doesn't throw
 *
 * const c = {};
 * const d = {};
 * strictEquals(c, d); // Throws
 * ```
 *
 * @typeParam T The type of the expected value.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function strictEquals<T>(
  actual: unknown,
  expected: T,
  msg?: string,
): asserts actual is T;
