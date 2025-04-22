// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { dirname as stableDirname } from "./dirname.js";
import { fromFileUrl } from "./from_file_url.js";
/**
 * Return the directory path of a file URL.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@hyprx/path/posix/unstable-dirname";
 * import { equal } from "@hyprx/assert";
 *
 * equal(dirname("/home/user/Documents/"), "/home/user");
 * equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * equal(dirname(new URL("file:///home/user/Documents/image.png")), "/home/user/Documents");
 * ```
 *
 * @param path The file url to get the directory from.
 * @returns The directory path.
 */
export function dirname(path) {
  if (path instanceof URL) {
    path = fromFileUrl(path);
  }
  return stableDirname(path);
}
