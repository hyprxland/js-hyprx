import type { Char } from "./types.js";
/**
 * Checks if the given value represents a letter.
 *
 * @param char - The numeric value to check.
 * @returns `true` if the value represents a letter, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLetter } from '@hyprx/chars/is-letter';
 *
 * console.log(isLetter(65)); // char 'A' Output: true
 * console.log(isLetter(48)); // char '0'  Output: false
 * ```
 */
export declare function isLetter(char: Char): boolean;
/**
 * Checks if the given value represents a letter.
 *
 * @description
 * The function skips the type check and the range check for a small performance boost.
 *
 * @param char - The numeric value to check.
 * @returns `true` if the value represents a letter, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLetterUnsafe } from '@hyprx/chars/is-letter';
 *
 * console.log(isLetterUnsafe(65)); // char 'A' Output: true
 * console.log(isLetterUnsafe(48)); // char '0'  Output: false
 * ```
 */
export declare function isLetterUnsafe(char: Char): boolean;
/**
 * Checks if the character at the specified index in the given string is a letter.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character at the specified index is a letter, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLetterAt } from "@hyprx/chars/is-letter";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isLetter = isLetterAt(str, index);
 * console.log(isLetter); // Output: true
 *
 * const str1 = "Hello, 123!";
 * const index1 = 8;
 * const isLetter1 = isLetterAt(str1, index1);
 * console.log(isLetter1); // Output: false
 * ```
 */
export declare function isLetterAt(value: string, index: number): boolean;
