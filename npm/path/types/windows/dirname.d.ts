/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@hyprx/path/windows/dirname";
 * import { equal } from "@hyprx/assert";
 *
 * const dir = dirname("C:\\foo\\bar\\baz.ext");
 * equal(dir, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@hyprx/path/windows/unstable-dirname`.
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
export declare function dirname(path: string): string;
