// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import type { GlobOptions } from "./_common/glob_to_reg_exp.ts";
import { isWindows } from "./_os.ts";
import { normalizeGlob as posixNormalizeGlob } from "./posix/normalize_glob.ts";
import { normalizeGlob as windowsNormalizeGlob } from "./windows/normalize_glob.ts";

export type { GlobOptions };

/**
 * Normalizes a glob string.
 *
 * Behaves like
 * {@linkcode https://jsr.io/@hyprx/path/doc/~/normalize | normalize()}, but
 * doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@hyprx/path/normalize-glob";
 * import { equal } from "@hyprx/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(normalizeGlob("foo\\bar\\..\\baz"), "foo\\baz");
 *   equal(normalizeGlob("foo\\**\\..\\bar\\..\\baz", { globstar: true }), "foo\\**\\..\\baz");
 * } else {
 *   equal(normalizeGlob("foo/bar/../baz"), "foo/baz");
 *   equal(normalizeGlob("foo/**\/../bar/../baz", { globstar: true }), "foo/**\/../baz");
 * }
 * ```
 *
 * @param glob Glob string to normalize.
 * @param options Glob options.
 * @returns The normalized glob string.
 */
export function normalizeGlob(
    glob: string,
    options: GlobOptions = {},
): string {
    return isWindows ? windowsNormalizeGlob(glob, options) : posixNormalizeGlob(glob, options);
}
