// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { join as stableJoin } from "./join.js";
import { fromFileUrl } from "./from_file_url.js";
/**
 * Join all given a sequence of `paths`, then normalizes the resulting path.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { join } from "@hyprx/path/windows/unstable-join";
 * import { equal } from "@hyprx/assert";
 *
 * equal(join("C:\\foo", "bar", "baz\\.."), "C:\\foo\\bar");
 * equal(join(new URL("file:///C:/foo"), "bar", "baz\\.."), "C:\\foo\\bar");
 * ```
 *
 * @param path The path to join. This can be string or file URL.
 * @param paths The paths to join.
 * @returns The joined path.
 */
export function join(path, ...paths) {
  path = path instanceof URL ? fromFileUrl(path) : path;
  paths = path ? [path, ...paths] : paths;
  return stableJoin(...paths);
}
