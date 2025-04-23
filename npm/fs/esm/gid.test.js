import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { gid } from "./gid.js";
import { WIN } from "./globals.js";
test("fs::gid returns number when not on windows", { skip: WIN }, () => {
  const g = gid();
  ok(g !== undefined && g !== null && g > -1);
});
