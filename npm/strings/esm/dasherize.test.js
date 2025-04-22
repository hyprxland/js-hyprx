import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { dasherize } from "./dasherize.js";
test("strings::dasherize", () => {
  equal("hello-world", dasherize("hello_world"));
  equal("hello-world", dasherize("helloWorld"));
  equal("hello-world", dasherize("hello-world"));
  equal("hello-world", dasherize("HELLO-WORLD"));
  equal("hello-world", dasherize("hello world"));
  equal("hello-world", dasherize("hello  world"));
  equal("hello-world", dasherize("hello   world"));
});
