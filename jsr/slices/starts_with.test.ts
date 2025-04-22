import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { startsWith, startsWithFold } from "./starts_with.ts";

test("slices::startsWithFold", () => {
    const tests = [
        { input: "hello world", test: "hello", result: true },
        { input: "hello world", test: "HEllo ", result: true },
        { input: "hello world", test: "HE", result: true },
        { input: "hello world", test: " hello", result: false },
        { input: "WÖrLD", test: "wörld", result: true },
    ];

    for (const { input, test, result } of tests) {
        const actual = startsWithFold(input, test);
        equal(actual, result);
    }
});

test("slices::startsWith", () => {
    const tests = [
        { input: "hello world", test: "hello", result: true },
        { input: "hello world", test: "HEllo ", result: false },
        { input: "hello world", test: "he", result: true },
        { input: "hello world", test: " hello", result: false },
        { input: "WÖrLD", test: "wörld", result: false },
        { input: "wörld", test: "wör", result: true },
    ];

    for (const { input, test, result } of tests) {
        const actual = startsWith(input, test);
        equal(actual, result);
    }
});
