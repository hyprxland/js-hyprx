/**
 * The equal module provides functions to compare strings for equality.
 * It includes case-sensitive and case-insensitive comparison functions.
 *
 * @module
 */

import { equal as og, equalFold as ogFold } from "@hyprx/slices/equal";
import type { CharBuffer } from "@hyprx/slices/utils";

/**
 * Determines whether the string is equal to the specified other string.
 * @param value The string to compare.
 * @param other The other string to compare.
 * @returns `true` if the strings are equal; otherwise, `false`.
 */
export function equal(value: string, other: CharBuffer): boolean {
    return og(value, other);
}

/**
 * Determines whether the string is equal to the specified other string
 * using case-insensitive comparison.
 *
 * @param value The string to compare.
 * @param other The other string to compare.
 * @returns `true` if the strings are equal; otherwise, `false`.
 */
export function equalFold(value: string, other: CharBuffer): boolean {
    if (value.length !== other.length) {
        return false;
    }

    return ogFold(value, other);
}
