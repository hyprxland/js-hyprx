import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { startsWith, startsWithFold } from "./starts_with.ts";

test("strings::startsWithFold", () => {
    ok(startsWithFold("Hello sdf", "hello"));
    ok(startsWithFold("Hello", "HELLO"));
});

test("strings::startsWith", () => {
    ok(startsWith("Hello sdf", "Hello"));
    ok(!startsWith("Hello", "HELLO"));
    ok(startsWith("Hello", "H"));
    ok(!startsWith("Hello", "o"));
    ok(!startsWith("Hello", "e"));
});
