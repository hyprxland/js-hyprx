import { isLetter, isLetterUnsafe } from "./is_letter.js";
import { isDigit, isDigitUnsafe } from "./is_digit.js";
/**
 * Determines whether the given character is a letter or digit.
 *
 * @param char The character to check.
 * @returns `true` if the character is a letter or digit; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLetterOrDigit } from "@hyprx/chars/is-letter-or-digit";
 *
 * console.log(isLetterOrDigit(0x10FFFF)); // Output: false
 * console.log(isLetterOrDigit(0.32)); // Output: false
 * console.log(isLetterOrDigit(48)); // Output: true
 * console.log(isLetterOrDigit(65)); // Output: true
 * console.log(isLetterOrDigit(97)); // Output: true
 * ```
 */
export function isLetterOrDigit(char) {
  return isLetter(char) || isDigit(char);
}
/**
 * Determines whether the given character is a letter or digit.
 *
 * @description
 * Skips the type check and error handling for a faster execution. It should
 * used when the character is known to be a valid Unicode code point such as
 * calling `codePointAt` on a string.
 *
 * @param char The character to check.
 * @returns `true` if the character is a letter or digit; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLetterOrDigitUnsafe } from "@hyprx/chars/is-letter-or-digit";
 *
 * console.log(isLetterOrDigitUnsafe(0x10FFFF)); // Output: false
 * console.log(isLetterOrDigitUnsafe(0.32)); // Output: false
 * console.log(isLetterOrDigitUnsafe(48)); // Output: true
 * console.log(isLetterOrDigitUnsafe(65)); // Output: true
 * console.log(isLetterOrDigitUnsafe(97)); // Output: true
 * ```
 */
export function isLetterOrDigitUnsafe(char) {
  return isLetterUnsafe(char) || isDigitUnsafe(char);
}
/**
 * Determines whether the character at the specified index in the given string is a letter or digit.
 *
 * @param str The input string.
 * @param index The index of the character to check.
 *
 * @returns `true` if the character at the specified index is a letter or digit; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLetterOrDigitAt } from "@hyprx/chars/is-letter-or-digit";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isLetterOrDigit = isLetterOrDigitAt(str, index);
 * console.log(isLetterOrDigit); // Output: true
 * ```
 */
export function isLetterOrDigitAt(str, index) {
  const code = str.codePointAt(index) ?? 0;
  return isLetterOrDigitUnsafe(code);
}
