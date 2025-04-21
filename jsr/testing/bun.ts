import type { TestContext, TestFunction, TestParams } from "./types.ts";

const importName = "bun:test";
const { test: bunTest } = await import(importName);
const { defaults } = await import("./globals.ts");

/**
 * Defines a test
 * @param name The name of the test.
 * @param options The test options.
 * @param fn The test function.
 */
export async function test(name: string, options?: TestParams, fn?: TestFunction): Promise<void>;
/**
 * Defines a test
 * @param name The name of the test.
 * @param fn The test function.
 */
export async function test(name: string, fn: TestFunction): Promise<void>;
export async function test(): Promise<void> {
    const name = arguments[0];
    const fn: TestFunction = typeof arguments[1] === "function" ? arguments[1] : arguments[2];
    const o: TestParams = typeof arguments[1] === "object" ? arguments[1] : {};
    if (o.timeout === undefined && defaults.timeout !== undefined) {
        o.timeout = defaults.timeout;
    }

    if (o.skip) {
        return await bunTest.skip(name, () => {});
    }

    return await bunTest(name, async () => {
        let test: Promise<void> | void = void (0);
        let close: () => void = () => {};

        const done = new Promise((resolve, reject) => {
            let closed = false;

            close = () => {
                if (closed) {
                    return;
                }

                closed = true;
                resolve(0);
            };

            test = fn({} as TestContext, (e: unknown) => {
                if (closed) {
                    return;
                }

                closed = true;
                if (e) {
                    reject(e);
                } else {
                    resolve(0);
                }
            });
        });

        const raceTask = Promise.race([done, test]);

        try {
            await raceTask;
        } finally {
            close();
        }
    }, o.timeout);
}
