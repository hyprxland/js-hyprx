import type { TestContext, TestFunction, TestParams } from "./types.ts";
const importName = "node:test";
const { test: nodeTest } = await import(importName);

/**
 * Defines a test
 * @param name The name of the test.
 * @param options The test options.
 * @param fn The test function.
 */
export function test(name: string, options?: TestParams, fn?: TestFunction): void;
/**
 * Defines a test
 * @param name The name of the test.
 * @param fn The test function.
 */
export function test(name: string, fn: TestFunction): void;
export function test(): void {
    const name = arguments[0];
    const fn: TestFunction = typeof arguments[1] === "function" ? arguments[1] : arguments[2];
    const o: TestParams = typeof arguments[1] === "object" ? arguments[1] : {};
    const nodeTestOptions = {
        skip: o.skip ?? false,
        timeout: o.timeout,
    };

    // deno-lint-ignore no-explicit-any
    nodeTest(name, nodeTestOptions, async (context: any) => {
        let test: Promise<void> | void = void (0);
        let close: () => void = () => {};

        try {
            const done = new Promise((resolve, reject) => {
                let closed = false;
                close = () => {
                    if (closed) {
                        return;
                    }

                    closed = true;
                    resolve(0);
                };

                test = fn(context as TestContext, (e) => {
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

            await Promise.race([done, test]);
        } finally {
            close();
        }
    });
}
