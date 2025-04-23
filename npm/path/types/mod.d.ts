/**
 * Path utilties for operating system file paths that is a re-package
 * of the [@std/path](https://jsr.io/@std/path) module with minor
 * changes to enable it to work in node and bun.
 *
 * @std/path which is based upon [browsify's implementation of path](https://github.com/browserify/path-browserify/tree/master).
 *
 * ![logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/path)](https://jsr.io/@hyprx/path)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Fpath.svg)](https://badge.fury.io/js/@hyprx%2Fpath)
 * [![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/path/doc)
 *
 * A list of other modules can be found at [github.com/hyprxland/js-hyprx](https://github.com/hyprxland/js-hyprx)
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
export * from "./basename.js";
export * from "./constants.js";
export * from "./dirname.js";
export * from "./extname.js";
export * from "./format.js";
export * from "./from_file_url.js";
export * from "./is_absolute.js";
export * from "./join.js";
export * from "./normalize.js";
export * from "./parse.js";
export * from "./relative.js";
export * from "./resolve.js";
export * from "./to_file_url.js";
export * from "./to_namespaced_path.js";
export * from "./common.js";
export * from "./types.js";
export * from "./glob_to_regexp.js";
export * from "./is_glob.js";
export * from "./join_globs.js";
export * from "./normalize_glob.js";
