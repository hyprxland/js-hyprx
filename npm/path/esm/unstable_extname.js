// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { isWindows } from "./_os.js";
import { extname as posixUnstableExtname } from "./posix/unstable_extname.js";
import { extname as windowsUnstableExtname } from "./windows/unstable_extname.js";
/**
 * Return the extension of the path with leading period (".").
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@hyprx/path/unstable-extname";
 * import { equal } from "@hyprx/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(extname("C:\\home\\user\\Documents\\image.png"), ".png");
 *   equal(extname(new URL("file:///C:/home/user/Documents/image.png")), ".png");
 * } else {
 *   equal(extname("/home/user/Documents/image.png"), ".png");
 *   equal(extname(new URL("file:///home/user/Documents/image.png")), ".png");
 * }
 * ```
 *
 * @param path Path with extension.
 * @returns The file extension. E.g. returns `.ts` for `file.ts`.
 */
export function extname(path) {
  return isWindows ? windowsUnstableExtname(path) : posixUnstableExtname(path);
}
