// Copyright 2018-2025 the Deno authors. MIT license.
import { equal } from "@hyprx/assert";
import { test } from "@hyprx/testing";
import { CHAR_FORWARD_SLASH } from "@hyprx/chars/constants";
import { normalizeString } from "./normalize_string.js";
function isSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
test("path::normalizeSring()", () => {
  equal(normalizeString("", true, "/", isSeparator), "");
  equal(normalizeString("", false, "/", isSeparator), "");
  equal(normalizeString("a/../b", true, "/", isSeparator), "b");
  equal(normalizeString("foo/bar/", true, "/", isSeparator), "foo/bar");
  equal(normalizeString("/foo/bar", true, "/", isSeparator), "foo/bar");
  equal(normalizeString("./foo/bar", true, "/", isSeparator), "foo/bar");
  equal(normalizeString("../foo/bar/baz/", true, "/", isSeparator), "../foo/bar/baz");
  equal(normalizeString("/foo/../../bar", true, "/", isSeparator), "../bar");
});
