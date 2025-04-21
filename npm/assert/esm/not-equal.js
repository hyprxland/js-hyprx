// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { deepEqual } from "./deep-equal.js";
import { AssertionError } from "./assertion-error.js";
import { format } from "./internal/format.js";
/**
 * Make an assertion that `actual` and `expected` are not equal, deeply.
 * If not then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the same type.
 *
 * @example Usage
 * ```ts ignore
 * import { assertNotEquals } from "@std/assert";
 *
 * assertNotEquals(1, 2); // Doesn't throw
 * assertNotEquals(1, 1); // Throws
 * ```
 *
 * @typeParam T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export function notEqual(actual, expected, msg) {
    if (!deepEqual(actual, expected)) {
        return;
    }
    const actualString = format(actual);
    const expectedString = format(expected);
    const msgSuffix = msg ? `: ${msg}` : ".";
    throw new AssertionError(`Expected actual: ${actualString} not to be: ${expectedString}${msgSuffix}`);
}
