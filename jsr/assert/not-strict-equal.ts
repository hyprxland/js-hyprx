// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.ts";
import { format } from "./internal/format.ts";

/**
 * Make an assertion that `actual` and `expected` are not strictly equal, using
 * {@linkcode Object.is} for equality comparison. If the values are strictly
 * equal then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { notStrictEquals } from "@hyprxassert";
 *
 * notStrictEquals(1, 1); // Throws
 * notStrictEquals(1, 2); // Doesn't throw
 *
 * notStrictEquals(0, 0); // Throws
 * notStrictEquals(0, -0); // Doesn't throw
 * ```
 *
 * @typeParam T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export function notStrictEquals<T>(
    actual: T,
    expected: T,
    msg?: string,
) {
    if (!Object.is(actual, expected)) {
        return;
    }

    const msgSuffix = msg ? `: ${msg}` : ".";
    throw new AssertionError(
        `Expected "actual" to not be strictly equal to: ${format(actual)}${msgSuffix}\n`,
    );
}
