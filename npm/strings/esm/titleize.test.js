import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { titleize } from "./titleize.js";
test("strings::titleize", () => {
  equal("Hello World", titleize("hello_world"));
  equal("Hello World", titleize("HELLoWorld"));
  equal("Hello World", titleize("HELLo-World"));
  equal("Hello World", titleize("HELLo World"));
  equal("Bob the Og", titleize("BobTheOG"));
});
