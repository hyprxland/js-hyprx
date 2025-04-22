import { test } from "@hyprx/testing";
import { equal, ok } from "@hyprx/assert";
import { CharArrayBuilder } from "@hyprx/slices/char-array-builder";
import { StringBuilder } from "./string_builder.js";
test("strings::StringBuilder constructor creates empty builder", () => {
  const sb = new StringBuilder();
  equal(0, sb.length);
  equal("", sb.toString());
});
test("strings::StringBuilder inherits from CharArrayBuilder", () => {
  const sb = new StringBuilder();
  ok(sb instanceof CharArrayBuilder);
});
test("strings::StringBuilder append adds characters", () => {
  const sb = new StringBuilder();
  sb.append("hello");
  equal(5, sb.length);
  equal("hello", sb.toString());
});
test("strings::StringBuilder append concatenates multiple strings", () => {
  const sb = new StringBuilder();
  sb.append("hello")
    .append(" ")
    .append("world");
  equal(11, sb.length);
  equal("hello world", sb.toString());
});
test("strings::StringBuilder clear resets the builder", () => {
  const sb = new StringBuilder();
  sb.append("hello");
  sb.clear();
  equal(0, sb.length);
  equal("", sb.toString());
});
