// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { basename as stableBasename } from "./basename.js";
import { fromFileUrl } from "./from_file_url.js";
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@hyprx/path/posix/unstable-basename";
 * import { equal } from "@hyprx/assert";
 *
 * equal(basename("/home/user/Documents/"), "Documents");
 * equal(basename("/home/user/Documents/image.png"), "image.png");
 * equal(basename("/home/user/Documents/image.png", ".png"), "image");
 * equal(basename(new URL("file:///home/user/Documents/image.png")), "image.png");
 * equal(basename(new URL("file:///home/user/Documents/image.png"), ".png"), "image");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */
export function basename(path, suffix = "") {
  path = path instanceof URL ? fromFileUrl(path) : path;
  return stableBasename(path, suffix);
}
