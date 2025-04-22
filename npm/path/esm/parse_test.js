// Copyright 2018-2025 the Deno authors. MIT license.
import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import * as windows from "./windows/mod.js";
test("path::windows.parse() parses UNC root only path", () => {
  const parsed = windows.parse("\\\\server\\share");
  equal(parsed, {
    base: "\\",
    dir: "\\\\server\\share",
    ext: "",
    name: "",
    root: "\\\\server\\share",
  });
});
