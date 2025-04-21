/**
 * The test context. If the test framework supports it, this will be passed to the test function.
 */
export interface TestContext extends Record<string | symbol, unknown | undefined> {
}
/**
 * A test function
 *
 * @param context - the test context.
 * @param done - the done function which can be used to force the test to finish.
 */
export type TestFunction = (context: TestContext, done: (e?: unknown) => void) => Promise<void> | void;
/**
 * Test parameters
 */
export interface TestParams extends Record<string | symbol, unknown | undefined> {
    /**
     * Skip the test when true.
     */
    skip?: boolean;
    /**
     * The timeout for the test
     */
    timeout?: number;
}
/**
 * A contract for a test function.
 */
export interface Test {
    /**
     * Defines a test
     * @param name - the name of the test
     * @param fn - the test function
     */
    (name: string, fn: TestFunction): void;
    /**
     * Defines a test
     * @param name - the name of the test
     * @param params - the test parameters
     * @param fn - the test function
     */
    (name: string, params: TestParams, fn: TestFunction): void;
}
