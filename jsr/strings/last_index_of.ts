import { lastIndexOf as og, lastIndexOfFold as ogFold } from "@hyprx/slices/last-index-of";
import type { CharBuffer } from "@hyprx/slices/utils";

/**
 * Gets the index of the last occurrence of the specified characters
 * in the string.
 * @param value The string to search.
 * @param chars The characters to search for.
 * @param index The index to start searching from.
 * @returns The index of the last occurrence of the characters in the string.
 * If the string is not found, returns -1.
 */
export function lastIndexOf(
    value: string,
    chars: CharBuffer,
    index = Number.POSITIVE_INFINITY,
): number {
    return og(value, chars, index);
}

/**
 * Gets the index of the last occurrence of the specified characters
 * in the string using case-insensitive comparison.
 * @param value The string to search.
 * @param chars The characters to search for.
 * @param index The index to start searching from.
 * @returns The index of the last occurrence of the characters in the string.
 * If the string is not found, returns -1.
 */
export function lastIndexOfFold(
    value: string,
    chars: CharBuffer,
    index = Number.POSITIVE_INFINITY,
): number {
    return ogFold(value, chars, index);
}
