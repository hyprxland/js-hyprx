import { test } from "@hyprx/testing";
import { equal, ok } from "@hyprx/assert";
import { popd } from "./popd.js";
import { pushd } from "./pushd.js";
test("process::popd and pushd", () => {
  const dir = "..";
  pushd(dir);
  const dir2 = popd();
  ok(dir2);
  equal(dir, dir2);
  equal(dir, "..");
  equal(popd(), undefined);
});
