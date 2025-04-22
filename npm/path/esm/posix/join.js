// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { assertPath } from "../_common/assert_path.js";
import { normalize } from "./normalize.js";
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@hyprx/path/posix/join";
 * import { equal } from "@hyprx/assert";
 *
 * const path = join("/foo", "bar", "baz/asdf", "quux", "..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @example Working with URLs
 * ```ts
 * import { join } from "@hyprx/path/posix/join";
 * import { equal } from "@hyprx/assert";
 *
 * const url = new URL("https://deno.land");
 * url.pathname = join("std", "path", "mod.ts");
 * equal(url.href, "https://deno.land/std/path/mod.ts");
 *
 * url.pathname = join("//std", "path/", "/mod.ts");
 * equal(url.href, "https://deno.land/std/path/mod.ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@hyprx/path/posix/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */
export function join(...paths) {
  if (paths.length === 0) {
    return ".";
  }
  paths.forEach((path) => assertPath(path));
  const joined = paths.filter((path) => path.length > 0).join("/");
  return joined === "" ? "." : normalize(joined);
}
