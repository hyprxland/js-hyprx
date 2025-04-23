/**
 * The `stringify` module provides functionality to convert an object of environment variables
 * into a string representation.
 *
 * @module
 */
import { StringBuilder } from "@hyprx/strings";
import { EOL } from "./globals.js";
/**
 * Converts an environment variables object into a string representation.
 *
 * @param env - An object containing environment variables as key-value pairs.
 * @param options - Optional settings for stringifying.
 * @param options.onlyLineFeed - If true, use only line feed (`\n`) for new lines instead of the default end-of-line sequence.
 * @returns The stringified representation of the environment variables.
 */
export function stringify(env, options) {
  const sb = new StringBuilder();
  let i = 0;
  const o = options ?? {};
  const nl = o.onlyLineFeed ? "\n" : EOL;
  for (const key in env) {
    if (i > 0) {
      sb.append(nl);
    }
    let value = env[key];
    sb.append(key).append("=");
    let quote = "'";
    if (value.includes(quote) || value.includes("\n")) {
      quote = '"';
      value = value.replace(/"/g, '\\"');
    }
    sb.append(quote).append(value).append(quote);
    i++;
  }
  return sb.toString();
}
