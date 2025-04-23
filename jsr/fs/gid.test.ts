import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { gid } from "./gid.ts";
import { WIN } from "./globals.ts";

test("fs::gid returns number when not on windows", { skip: WIN }, () => {
    const g = gid();
    ok(g !== undefined && g !== null && g > -1);
});
