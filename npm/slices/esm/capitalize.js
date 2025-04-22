/**
 * This module provides a function to capitalize the first character of a string.
 * The capitalize function converts the first character of a string to uppercase
 * and the rest to lowercase by default. It can also preserve the case of the
 * characters that are not the first character if specified in the options.
 * @module
 */
import { toCharSliceLike } from "./utils.js";
import { toLower } from "@hyprx/chars/to-lower";
import { toUpper } from "@hyprx/chars/to-upper";
/**
 * Capitalize converts the first character of a string to uppercase. By default, it
 * converts the first character to uppercase and the rest to lowercase.
 *
 * @description
 * To avoid allocations, the function returns a Uint32Array that represents
 * the capitalized string.  To convert the Uint32Array to a string, use
 * `String.fromCharCode(...capitalized)`.
 *
 * @param value The string to capitalize.
 * @param options The options for the function.
 * @returns The capitalized string as a Uint32Array.
 * @example
 * ```typescript
 * import { capitalize } from '@hyprx/slices/capitalize';
 *
 * const capitalized = capitalize("hello world");
 * console.log(String.fromCodePoint(...capitalized)); // Output: "Hello world"
 * ```
 */
export function capitalize(value, options) {
  const v = toCharSliceLike(value);
  options ??= {};
  const buffer = new Uint32Array(v.length);
  if (v instanceof Uint32Array) {
    buffer.set(v);
    buffer[0] = toUpper(buffer[0]);
    return buffer;
  }
  for (let i = 0; i < value.length; i++) {
    const r = v.at(i);
    if (r === undefined) {
      buffer[i] = 0;
      continue;
    }
    if (i === 0) {
      buffer[i] = toUpper(r);
      continue;
    }
    if (options.preserveCase) {
      buffer[i] = r;
      continue;
    }
    buffer[i] = toLower(r);
  }
  return buffer;
}
