import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { cwd } from "./cwd.js";
test("fs::cwd is not empty", () => {
  ok(cwd() !== "");
});
