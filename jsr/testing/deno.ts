import type { TestContext, TestFunction, TestParams } from "./types.ts";
import { defaults, globals } from "./globals.ts";

if (!globals.Deno) {
    throw new Error("Deno not found");
}

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
    if (o.timeout === undefined && defaults.timeout !== undefined) {
        o.timeout = defaults.timeout;
    }

    globals.Deno.test({
        name,
        ignore: o.skip,
        // deno-lint-ignore no-explicit-any
        fn: async (ctx: any) => {
            let test: Promise<void> | void = void (0);
            let close: () => void = () => {};
            let closeTimeout: () => void = () => {};

            const done = new Promise((resolve, reject) => {
                let closed = false;

                close = () => {
                    if (closed) {
                        return;
                    }

                    closed = true;
                    resolve(0);
                };

                test = fn(ctx as TestContext, (e) => {
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
                if (o.timeout) {
                    const timeoutTask = new Promise((resolve, reject) => {
                        const handle = setTimeout(() => {
                            reject(new Error("Test timed out"));
                        }, o.timeout);

                        closeTimeout = () => {
                            clearTimeout(handle);
                            resolve(0);
                        };
                    });

                    await Promise.race([raceTask, timeoutTask]);
                } else {
                    await raceTask;
                }
            } finally {
                closeTimeout();
                close();
            }
        },
    });
}
