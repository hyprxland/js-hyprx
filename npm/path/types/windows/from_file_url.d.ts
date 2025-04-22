/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@hyprx/path/windows/from-file-url";
 * import { equal } from "@hyprx/assert";
 *
 * equal(fromFileUrl("file:///home/foo"), "\\home\\foo");
 * equal(fromFileUrl("file:///C:/Users/foo"), "C:\\Users\\foo");
 * equal(fromFileUrl("file://localhost/home/foo"), "\\home\\foo");
 * ```
 *
 * @param url The file URL to convert.
 * @returns The path string.
 */
export declare function fromFileUrl(url: URL | string): string;
