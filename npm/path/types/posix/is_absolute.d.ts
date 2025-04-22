/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@hyprx/path/posix/is-absolute";
 * import { assert, assertFalse } from "@hyprx/assert";
 *
 * assert(isAbsolute("/home/user/Documents/"));
 * assertFalse(isAbsolute("home/user/Documents/"));
 * ```
 *
 * @param path The path to verify.
 * @returns Whether the path is absolute.
 */
export declare function isAbsolute(path: string): boolean;
