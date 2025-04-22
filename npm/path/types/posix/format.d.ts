import type { ParsedPath } from "../types.js";
/**
 * Generate a path from `ParsedPath` object.
 *
 * @example Usage
 * ```ts
 * import { format } from "@hyprx/path/posix/format";
 * import { equal } from "@hyprx/assert";
 *
 * const path = format({
 *   root: "/",
 *   dir: "/path/dir",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * equal(path, "/path/dir/file.txt");
 * ```
 *
 * @param pathObject The path object to format.
 * @returns The formatted path.
 */
export declare function format(pathObject: Partial<ParsedPath>): string;
