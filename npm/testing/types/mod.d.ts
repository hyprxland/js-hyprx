/**
 * ## Overview
 *
 * An adapter for the builtin Deno, Bun, and NodeJs testing frameworks which is
 * useful for library authors that are targeting multiple runtimes.
 *
 * The aim is provide a standard subset to run tests against all 3 runtimes
 * rather than implement all features and test styles until node:test is available
 * in all three testing runtimes.
 *
 * [logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/testing)](https://jsr.io/@hyprx/testing)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Ftesting.svg)](https://badge.fury.io/js/@hyprx%2Ftesting)
 * [![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-testing.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-testing)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/testing/doc)
 *
 * ## Usage
 *
 * psuedo code to show off the test function.
 *
 * ```typescript
 * import { test } from "@hyprx/testing";
 *
 * test("simple", () => {
 *     console.log("test");
 * });
 *
 * test("use done", (_, done) => {
 *
 *     done(); // finishes the test.
 *
 *     done(new Error()) // finishes the test and throws an error.
 * });
 *
 * test("async", async () => {
 *     await Deno.writeTextFile("test.txt", test);
 *
 *     await exists("test.txt");
 * });
 *
 * test("skip", { skip: true}, () => {
 *     console.log("skipped test");
 * });
 *
 * test("timeout", { timeout: 2000 }, () => {
 *     // the test timeout will be exceeded
 *     setTimeout(() => { }, 3000);
 * });
 *
 * ```
 *
 * ## Functions
 *
 * - `test` - defines a test
 *
 * ## Notes
 *
 * This library was written with the frustration of dealing with @denoland/dnt which shims Deno.test
 * and generates alot of excess code. It is cleaner to just run `node --test` and `bun test` to ensure
 * that the tests are executed against the other runtimes.
 *
 * I also tried vitest. Vitest was failing to work with deno outside of very limit contexts.
 * Vitest is cool, but it is/was heavy on the dependencies.  The number of dependencies increased
 * times for scripts to run and and it required dealing with the headache of nodeModulesDir=auto.
 * @module
 * @license MIT
 */
import type { Test } from "./types.js";
export * from "./types.js";
/**
 * The test function defines tests.
 */
export declare const test: Test;
