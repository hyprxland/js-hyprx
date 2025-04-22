/**
 * The pascalize module provides a function to convert a string to pascal case.
 *
 * @module
 */
import { pascalize as og } from "@hyprx/slices/pascalize";
/**
 * Converts the string to pascal case. This is primarily for converting
 * code to pascal case.
 * @param value The string to pascalize.
 * @param options The options for the function.
 * @returns A string in camel case.
 */
export function pascalize(value) {
  const r = og(value);
  return String.fromCodePoint(...r);
}
