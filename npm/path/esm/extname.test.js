// Copyright 2018-2025 the Deno authors. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import * as posix from "./posix/mod.js";
import * as windows from "./windows/mod.js";
import { extname as posixUnstableExtname } from "./posix/unstable_extname.js";
import { extname as windowsUnstableExtname } from "./windows/unstable_extname.js";
const slashRE = /\//g;
const pairs = [
  ["", ""],
  ["/path/to/file", ""],
  ["/path/to/file.ext", ".ext"],
  ["/path.to/file.ext", ".ext"],
  ["/path.to/file", ""],
  ["/path.to/.file", ""],
  ["/path.to/.file.ext", ".ext"],
  ["/path/to/f.ext", ".ext"],
  ["/path/to/..ext", ".ext"],
  ["/path/to/..", ""],
  ["file", ""],
  ["file.ext", ".ext"],
  [".file", ""],
  [".file.ext", ".ext"],
  ["/file", ""],
  ["/file.ext", ".ext"],
  ["/.file", ""],
  ["/.file.ext", ".ext"],
  [".path/file.ext", ".ext"],
  ["file.ext.ext", ".ext"],
  ["file.", "."],
  [".", ""],
  ["./", ""],
  [".file.ext", ".ext"],
  [".file", ""],
  [".file.", "."],
  [".file..", "."],
  ["..", ""],
  ["../", ""],
  ["..file.ext", ".ext"],
  ["..file", ".file"],
  ["..file.", "."],
  ["..file..", "."],
  ["...", "."],
  ["...ext", ".ext"],
  ["....", "."],
  ["file.ext/", ".ext"],
  ["file.ext//", ".ext"],
  ["file/", ""],
  ["file//", ""],
  ["file./", "."],
  ["file.//", "."],
];
test("path::posix.extname()", function () {
  pairs.forEach(function (p) {
    const input = p[0];
    const expected = p[1];
    equal(expected, posix.extname(input));
  });
  // On *nix, backslash is a valid name component like any other character.
  equal(posix.extname(".\\"), "");
  equal(posix.extname("..\\"), ".\\");
  equal(posix.extname("file.ext\\"), ".ext\\");
  equal(posix.extname("file.ext\\\\"), ".ext\\\\");
  equal(posix.extname("file\\"), "");
  equal(posix.extname("file\\\\"), "");
  equal(posix.extname("file.\\"), ".\\");
  equal(posix.extname("file.\\\\"), ".\\\\");
  equal(posixUnstableExtname(new URL("file:///home/user/Documents/image.png")), ".png");
  equal(posixUnstableExtname(new URL("file:///home/user/Documents")), "");
});
test("path::windows.extname()", function () {
  pairs.forEach(function (p) {
    const input = p[0].replace(slashRE, "\\");
    const expected = p[1];
    equal(expected, windows.extname(input));
    equal(expected, windows.extname("C:" + input));
  });
  // On Windows, backslash is a path separator.
  equal(windows.extname(".\\"), "");
  equal(windows.extname("..\\"), "");
  equal(windows.extname("file.ext\\"), ".ext");
  equal(windows.extname("file.ext\\\\"), ".ext");
  equal(windows.extname("file\\"), "");
  equal(windows.extname("file\\\\"), "");
  equal(windows.extname("file.\\"), ".");
  equal(windows.extname("file.\\\\"), ".");
  equal(windowsUnstableExtname(new URL("file:///C:/home/user/Documents/image.png")), ".png");
  equal(windowsUnstableExtname(new URL("file:///C:/home/user/Documents")), "");
});
