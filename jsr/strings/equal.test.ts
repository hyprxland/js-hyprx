import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { equal, equalFold } from "./equal.ts";

test("strings::equalFold", () => {
    ok(equalFold("Hello", "hello"));
    ok(equalFold("Hello", "HELLO"));
});

test("strings::equal", () => {
    ok(equal("Hello", "Hello"));
    ok(!equal("Hello", "HELLO"));
});
