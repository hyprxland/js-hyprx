// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { normalize as stableNormalize } from "./normalize.js";
import { fromFileUrl } from "./from_file_url.js";
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@hyprx/path/posix/unstable-normalize";
 * import { equal } from "@hyprx/assert";
 *
 * equal(normalize("/foo/bar//baz/asdf/quux/.."), "/foo/bar/baz/asdf");
 * equal(normalize(new URL("file:///foo/bar//baz/asdf/quux/..")), "/foo/bar/baz/asdf/");
 * ```
 *
 * @param path The path to normalize. Path can be a string or a file URL object.
 * @returns The normalized path.
 */
export function normalize(path) {
  path = path instanceof URL ? fromFileUrl(path) : path;
  return stableNormalize(path);
}
