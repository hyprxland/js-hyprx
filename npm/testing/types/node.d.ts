import type { TestFunction, TestParams } from "./types.js";
/**
 * Defines a test
 * @param name The name of the test.
 * @param options The test options.
 * @param fn The test function.
 */
export declare function test(name: string, options?: TestParams, fn?: TestFunction): void;
/**
 * Defines a test
 * @param name The name of the test.
 * @param fn The test function.
 */
export declare function test(name: string, fn: TestFunction): void;
