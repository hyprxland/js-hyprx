import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { pid } from "./pid.js";
import { globals } from "@hyprx/runtime-info";
test("process::pid", () => {
  if (globals.Deno || globals.process) {
    ok(pid > 0);
  } else {
    ok(pid === 0);
  }
});
