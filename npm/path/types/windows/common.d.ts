/**
 * Determines the common path from a set of paths for Windows systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@hyprx/path/windows/common";
 * import { equal } from "@hyprx/assert";
 *
 * const path = common([
 *   "C:\\foo\\bar",
 *   "C:\\foo\\baz",
 * ]);
 * equal(path, "C:\\foo\\");
 * ```
 *
 * @param paths The paths to compare.
 * @returns The common path.
 */
export declare function common(paths: string[]): string;
