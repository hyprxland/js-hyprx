// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { common as _common } from "./_common/common.js";
import { SEPARATOR } from "./constants.js";
/**
 * Determines the common path from a set of paths for the given OS.
 *
 * @param paths Paths to search for common path.
 * @returns The common path.
 *
 * @example Usage
 * ```ts
 * import { common } from "@hyprx/path/common";
 * import { equal } from "@hyprx/assert";
 *
 * if (Deno.build.os === "windows") {
 *   const path = common([
 *     "C:\\deno\\std\\path\\mod.ts",
 *     "C:\\deno\\std\\fs\\mod.ts"
 *   ]);
 *   equal(path, "C:\\deno\\std\\");
 * } else {
 *   const path = common([
 *     "./deno/std/path/mod.ts",
 *     "./deno/std/fs/mod.ts"
 *   ]);
 *   equal(path, "./deno/std/");
 * }
 * ```
 */
export function common(paths) {
  return _common(paths, SEPARATOR);
}
