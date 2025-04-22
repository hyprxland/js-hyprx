// Copyright 2018-2025 the Deno authors. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
// This module is browser compatible.

/**
 * Path utilties for operating system file paths that is a re-package
 * of the [@std/path](https://jsr.io/@std/path) module with minor
 * changes to enable it to work in node and bun.
 *
 * @std/path which is based upon [browsify's implementation of path](https://github.com/browserify/path-browserify/tree/master).
 *
 * ![logo](https://raw.githubusercontent.com/bearz-io/js/refs/heads/main/eng/assets/bearz.io.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/path)](https://jsr.io/@hyprx/path)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Fpath.svg)](https://badge.fury.io/js/@hyprx%2Fpath)
 * [![GitHub version](https://badge.fury.io/gh/bearz-io%2Fjs-path.svg)](https://badge.fury.io/gh/bearz-io%2Fjs-path)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/path/doc)
 *
 * A list of other modules can be found at [github.com/bearz-io/js](https://github.com/bearz-io/js)
 *
 * ## Usage
 *
 * ```typescript
 * import { resolve, join, isAbsolute, basename, dirname } from "@hyprx/path";
 *
 * console.log(isAbsolute("./test"));
 *
 * const dir = resolve("./test");
 * const file = join(dir, "text.txt");
 * console.log(dir);
 * console.log(isAbsolute(dir));
 * console.log(file);
 * console.log(dirname(file));
 * console.log(basename(file))
 *
 * ```
 *
 * ## Functions
 *
 * - **basename** - Return the last portion of a path.
 * - **common** - Determines the common path from a set of paths for the given OS.
 * - **dirname** - Return the directory path of a path.
 * - **extname** - Return the extension of the path with leading period (".").
 * - **format** - Generate a path from a ParsedPath object.
 * - **fromFileUrl** - Converts a file URL to a path string.
 * - **globToRegexp** - Converts a glob string to a regular expression.
 * - **isAbsolute** - Verifies whether provided path is absolute.
 * - **isGlob** - Test whether the given string is a glob.
 * - **joinGlobs** - Joins a sequence of globs, then normalizes the resulting glob.
 * - **join** - Joins a sequence of paths, then normalizes the resulting path.
 * - **normalizeGlob** - Normalizes a glob string.
 * - **normalize** - Normalize the path, resolving `'..'` and `'.'` segments.
 * - **parse** - Return an object containing the parsed components of the path.
 * - **relative** - Return the relative path from `from` to `to` based on current working direct.
 * - **resolve** -  Resolves path segments into a path.
 * - **toFileUrl** - Converts a path string to a file URL.
 * - **toNamespacedPath** - Resolves path to a namespace path.  This is a no-op on non-windows systems.
 *
 * ## Notes
 *
 * @hyprx/path is repackaging @std/path to enable it for node/bun and avoid a depdendency on jsr
 * when shipping @hyprx modules to npm avoid issues with shimming between @std/path
 * and `node:path` and include the extra methods such as `toFileUrl` and `fromFileUrl`.
 * @module
 */
export * from "./basename.ts";
export * from "./constants.ts";
export * from "./dirname.ts";
export * from "./extname.ts";
export * from "./format.ts";
export * from "./from_file_url.ts";
export * from "./is_absolute.ts";
export * from "./join.ts";
export * from "./normalize.ts";
export * from "./parse.ts";
export * from "./relative.ts";
export * from "./resolve.ts";
export * from "./to_file_url.ts";
export * from "./to_namespaced_path.ts";
export * from "./common.ts";
export * from "./types.ts";
export * from "./glob_to_regexp.ts";
export * from "./is_glob.ts";
export * from "./join_globs.ts";
export * from "./normalize_glob.ts";
