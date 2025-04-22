// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { isWindows } from "./_os.js";
import { parse as posixParse } from "./posix/parse.js";
import { parse as windowsParse } from "./windows/parse.js";
/**
 * Return an object containing the parsed components of the path.
 *
 * Use {@linkcode https://jsr.io/@hyprx/path/doc/~/format | format()} to reverse
 * the result.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@hyprx/path/parse";
 * import { equal } from "@hyprx/assert";
 *
 * if (Deno.build.os === "windows") {
 *   const parsedPathObj = parse("C:\\path\\to\\script.ts");
 *   equal(parsedPathObj.root, "C:\\");
 *   equal(parsedPathObj.dir, "C:\\path\\to");
 *   equal(parsedPathObj.base, "script.ts");
 *   equal(parsedPathObj.ext, ".ts");
 *   equal(parsedPathObj.name, "script");
 * } else {
 *   const parsedPathObj = parse("/path/to/dir/script.ts");
 *   parsedPathObj.root; // "/"
 *   parsedPathObj.dir; // "/path/to/dir"
 *   parsedPathObj.base; // "script.ts"
 *   parsedPathObj.ext; // ".ts"
 *   parsedPathObj.name; // "script"
 * }
 * ```
 *
 * @param path Path to process
 * @returns An object with the parsed path components.
 */
export function parse(path) {
  return isWindows ? windowsParse(path) : posixParse(path);
}
