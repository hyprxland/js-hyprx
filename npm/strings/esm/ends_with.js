/**
 * The ends-with module provides functions to check if a string ends with a
 * specified suffix. It includes both case-sensitive and case-insensitive
 * comparisons. The functions are primarily used for string manipulation
 * and validation.
 * @module
 */
import { endsWith as og, endsWithFold as ogFold } from "@hyprx/slices/ends-with";
/**
 * Determines whether the string ends with the specified suffix using
 * case-insensitive comparison.
 * @param value The string to check.
 * @param suffix The suffix to check for.
 * @returns `true` if the string ends with the suffix; otherwise, `false`.
 */
export function endsWithFold(value, suffix) {
  if (suffix.length > value.length) {
    return false;
  }
  return ogFold(value, suffix);
}
/**
 * Determines whether the string ends with the specified suffix.
 * @param value The string to check.
 * @param suffix The suffix to check for.
 * @returns `true` if the string ends with the suffix; otherwise, `false`.
 */
export function endsWith(value, suffix) {
  if (suffix.length > value.length) {
    return false;
  }
  return og(value, suffix);
}
