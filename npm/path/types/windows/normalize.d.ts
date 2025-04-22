/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@hyprx/path/windows/normalize";
 * import { equal } from "@hyprx/assert";
 *
 * const normalized = normalize("C:\\foo\\..\\bar");
 * equal(normalized, "C:\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `normalize` from `@hyprx/path/windows/unstable-normalize`.
 *
 * @param path The path to normalize
 * @returns The normalized path
 */
export declare function normalize(path: string): string;
