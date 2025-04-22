import { test } from "@hyprx/testing";
import { nope, ok } from "@hyprx/assert";
import { isUndefined } from "./is_undefined.js";
test("strings::isUndefined returns true for undefined", () => {
  const s = undefined;
  ok(isUndefined(s));
});
test("strings::isUndefined returns false for empty string", () => {
  const s = "";
  nope(isUndefined(s));
});
test("strings::isUndefined returns false for non-empty string", () => {
  const s = "test";
  nope(isUndefined(s));
});
