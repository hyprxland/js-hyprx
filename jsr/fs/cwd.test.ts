import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { cwd } from "./cwd.ts";

test("fs::cwd is not empty", () => {
    ok(cwd() !== "");
});
