import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { join, resolve } from "@hyprx/path";
import { chdir } from "./chdir.js";
import { cwd } from "./cwd.js";
test("process::chdir and cwd", () => {
  const pwd = cwd();
  const dir = resolve(join(pwd, ".."));
  equal(pwd, cwd());
  equal(chdir(dir), undefined);
  equal(cwd(), dir);
  chdir(pwd);
});
