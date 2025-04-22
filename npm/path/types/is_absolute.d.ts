/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@hyprx/path/is-absolute";
 * import { assert, assertFalse } from "@hyprx/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assert(isAbsolute("C:\\home\\foo"));
 *   assertFalse(isAbsolute("home\\foo"));
 * } else {
 *   assert(isAbsolute("/home/foo"));
 *   assertFalse(isAbsolute("home/foo"));
 * }
 * ```
 *
 * @param path Path to be verified as absolute.
 * @returns `true` if path is absolute, `false` otherwise
 */
export declare function isAbsolute(path: string): boolean;
