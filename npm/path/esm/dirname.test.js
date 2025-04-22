// Copyright 2018-2025 the Deno authors. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import { test } from "@hyprx/testing";
import { equal, throws } from "@hyprx/assert";
import { dirname } from "./dirname.js";
import * as posix from "./posix/mod.js";
import * as windows from "./windows/mod.js";
import { dirname as windowsUnstableDirname } from "./windows/unstable_dirname.js";
import { dirname as posixUnstableDirname } from "./posix/unstable_dirname.js";
// Test suite from "GNU core utilities"
// https://github.com/coreutils/coreutils/blob/master/tests/misc/dirname.pl
const COREUTILS_TESTSUITE = [
  ["d/f", "d"],
  ["/d/f", "/d"],
  ["d/f/", "d"],
  ["d/f//", "d"],
  ["f", "."],
  ["/", "/"],
  ["//", "/"],
  ["///", "/"],
  ["//a//", "/"],
  ["///a///", "/"],
  ["///a///b", "///a"],
  ["///a//b/", "///a"],
  ["", "."],
];
const POSIX_TESTSUITE = [
  ["/a/b/", "/a"],
  ["/a/b", "/a"],
  ["/a", "/"],
  ["", "."],
  ["/", "/"],
  ["////", "/"],
  ["//a", "/"],
  ["foo", "."],
];
const WINDOWS_TESTSUITE = [
  ["c:\\", "c:\\"],
  ["c:\\foo", "c:\\"],
  ["c:\\foo\\", "c:\\"],
  ["c:\\foo\\bar", "c:\\foo"],
  ["c:\\foo\\bar\\", "c:\\foo"],
  ["c:\\foo\\bar\\baz", "c:\\foo\\bar"],
  ["\\", "\\"],
  ["\\foo", "\\"],
  ["\\foo\\", "\\"],
  ["\\foo\\bar", "\\foo"],
  ["\\foo\\bar\\", "\\foo"],
  ["\\foo\\bar\\baz", "\\foo\\bar"],
  ["c:", "c:"],
  ["c:foo", "c:"],
  ["c:foo\\", "c:"],
  ["c:foo\\bar", "c:foo"],
  ["c:foo\\bar\\", "c:foo"],
  ["c:foo\\bar\\baz", "c:foo\\bar"],
  ["file:stream", "."],
  ["dir\\file:stream", "dir"],
  ["\\\\unc\\share", "\\\\unc\\share"],
  ["\\\\unc\\share\\foo", "\\\\unc\\share\\"],
  ["\\\\unc\\share\\foo\\", "\\\\unc\\share\\"],
  ["\\\\unc\\share\\foo\\bar", "\\\\unc\\share\\foo"],
  ["\\\\unc\\share\\foo\\bar\\", "\\\\unc\\share\\foo"],
  ["\\\\unc\\share\\foo\\bar\\baz", "\\\\unc\\share\\foo\\bar"],
  ["/a/b/", "/a"],
  ["/a/b", "/a"],
  ["/a", "/"],
  ["", "."],
  ["/", "/"],
  ["////", "/"],
  ["foo", "."],
];
test("path::posix.dirname()", function () {
  for (const [name, expected] of COREUTILS_TESTSUITE) {
    equal(dirname(name), expected);
  }
  for (const [name, expected] of POSIX_TESTSUITE) {
    equal(posix.dirname(name), expected);
  }
  // POSIX treats backslash as any other character.
  equal(posix.dirname("\\foo/bar"), "\\foo");
  equal(posix.dirname("\\/foo/bar"), "\\/foo");
  equal(posix.dirname("/foo/bar\\baz/qux"), "/foo/bar\\baz");
  equal(posix.dirname("/foo/bar/baz\\"), "/foo/bar");
});
test("path::posix.dirname() works with file URLs", () => {
  equal(
    posixUnstableDirname(new URL("file:///home/user/Documents/image.png")),
    "/home/user/Documents",
  );
  // throws with non-file URLs
  throws(
    () => posixUnstableDirname(new URL("https://deno.land/")),
    TypeError,
    'URL must be a file URL: received "https:"',
  );
});
test("path::windows.dirname()", function () {
  for (const [name, expected] of WINDOWS_TESTSUITE) {
    equal(windows.dirname(name), expected);
  }
  // windows should pass all "forward slash" posix tests as well.
  for (const [name, expected] of COREUTILS_TESTSUITE) {
    equal(windows.dirname(name), expected);
  }
  for (const [name, expected] of POSIX_TESTSUITE) {
    equal(windows.dirname(name), expected);
  }
});
test("path::windows.dirname() works with file URLs", () => {
  equal(
    windowsUnstableDirname(new URL("file:///C:/home/user/Documents/image.png")),
    "C:\\home\\user\\Documents",
  );
  // throws with non-file URLs
  throws(
    () => windowsUnstableDirname(new URL("https://deno.land/")),
    TypeError,
    'URL must be a file URL: received "https:"',
  );
});
