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
 * import { dirname } from "@hyprx/path/windows/unstable-dirname";
 * import { equal } from "@hyprx/assert";
 *
 * equal(dirname("C:\\foo\\bar\\baz.ext"), "C:\\foo\\bar");
 * equal(dirname(new URL("file:///C:/foo/bar/baz.ext")), "C:\\foo\\bar");
 * ```
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
export function dirname(path) {
  if (path instanceof URL) {
    path = fromFileUrl(path);
  }
  return stableDirname(path);
}
