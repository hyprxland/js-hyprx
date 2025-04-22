/** Determines the common path from a set of paths for POSIX systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@hyprx/path/posix/common";
 * import { equal } from "@hyprx/assert";
 *
 * const path = common([
 *   "./deno/std/path/mod.ts",
 *   "./deno/std/fs/mod.ts",
 * ]);
 * equal(path, "./deno/std/");
 * ```
 *
 * @param paths The paths to compare.
 * @returns The common path.
 */
export declare function common(paths: string[]): string;
