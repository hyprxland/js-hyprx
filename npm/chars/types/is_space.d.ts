import type { Char } from "./types.js";
/**
 * Checks if the given character is a whitespace character.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 */
export declare function isSpace(char: Char): boolean;
/**
 * Checks if the given character is a whitespace character.
 * @param char The character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 */
export declare function isSpaceUnsafe(char: Char): boolean;
/**
 * Checks if the character at the specified index in the given string is a whitespace character.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isWhiteSpaceAt } from "@hyprx/chars";
 *
 * const str = "Hello, world!";
 * console.log(isSpaceAt(str, 4)); // Output: false
 * console.log(isSpaceAt(str, 6)); // Output: true
 * ```
 */
export declare function isSpaceAt(value: string, index: number): boolean;
