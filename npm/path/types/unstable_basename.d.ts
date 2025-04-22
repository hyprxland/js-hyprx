/**
 * Return the last portion of a path.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * The trailing directory separators are ignored, and optional suffix is
 * removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@hyprx/path/unstable-basename";
 * import { equal } from "@hyprx/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(basename("C:\\user\\Documents\\image.png"), "image.png");
 *   equal(basename(new URL("file:///C:/user/Documents/image.png")), "image.png");
 * } else {
 *   equal(basename("/home/user/Documents/image.png"), "image.png");
 *   equal(basename(new URL("file:///home/user/Documents/image.png")), "image.png");
 * }
 * ```
 *
 * @param path Path to extract the name from.
 * @param suffix Suffix to remove from extracted name.
 *
 * @returns The basename of the path.
 */
export declare function basename(path: string | URL, suffix?: string): string;
