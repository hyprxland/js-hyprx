import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { split } from "./split.ts";

test("strings::split splits string with separator", () => {
    const result = split("a,b,c", ",");
    equal(result, ["a", "b", "c"]);
});

test("strings::split splits string with regex separator", () => {
    const result = split("a,b;c", /[,;]/);
    equal(result, ["a", "b", "c"]);
});

test("strings::split handles Uint8Array input", () => {
    const encoder = new TextEncoder();
    const input = encoder.encode("a,b,c");
    const result = split(input, ",");
    equal(result, ["a", "b", "c"]);
});

test("strings::split handles Uint32Array input", () => {
    const input = new Uint32Array([97, 44, 98, 44, 99]); // "a,b,c"
    const result = split(input, ",");
    equal(result, ["a", "b", "c"]);
});

test("strings::split with trim option removes whitespace and empty strings", () => {
    const result = split(" a , b , c , ", ",", true);
    equal(result, ["a", "b", "c"]);
});

test("strings::split respects limit parameter", () => {
    const result = split("a,b,c,d", ",", false, 2);
    equal(result, ["a", "b"]);
});

test("strings::split with trim and limit combined", () => {
    const result = split(" a , b , c , d ", ",", true, 2);
    equal(result, ["a", "b"]);
});
