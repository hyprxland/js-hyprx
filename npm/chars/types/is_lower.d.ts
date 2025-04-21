import type { Char } from "./types.js";
/**
 * Checks if the given value represents a lowercase letter.
 * @param char The char to check.
 * @returns `true` if the value represents a lowercase letter; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLower } from "@hyprx/chars/is-lower";
 *
 * console.log(isLower(0x61)); // Output: true
 * console.log(isLower(0x41)); // Output: false
 * console.log(isLower(0x10FFFF)); // Output: false
 * console.log(isLower(0.32)); // Output: false
 * ```
 */
export declare function isLower(char: Char): boolean;
/**
 * Checks if the given value represents a lowercase letter.
 *
 * @description
 * The function skips the type check and the range check for a small performance boost.
 *
 * @param char The char to check.
 * @returns `true` if the value represents a lowercase letter; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLowerUnsafe } from "@hyprx/chars/is-lower";
 *
 * console.log(isLowerUnsafe(0x61)); // Output: true
 * console.log(isLowerUnsafe(0x41)); // Output: false
 * console.log(isLowerUnsafe(0x10FFFF)); // Output: false
 * console.log(isLowerUnsafe(0.32)); // Output: false
 * ```
 */
export declare function isLowerUnsafe(char: Char): boolean;
/**
 * Checks if the character at the specified index in the given string is a lowercase letter.
 *
 * @param str The string to check.
 * @param index The index of the character to check.
 * @returns `true` if the character at the specified index is a lowercase letter; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLowerAt } from "@hyprx/chars/is-lower";
 *
 * const str = "Hello, world!";
 * console.log(isLowerAt(str, 5)); // Output: false
 * console.log(isLowerAt(str, 2)); // Output: true
 * console.log(isLowerAt(str, 0)); // Output: false
 * ```
 */
export declare function isLowerAt(str: string, index: number): boolean;
