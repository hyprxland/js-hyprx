import { defaults, globals } from "./globals.js";
if (!globals.Deno) {
    throw new Error("Deno not found");
}
export function test() {
    const name = arguments[0];
    const fn = typeof arguments[1] === "function" ? arguments[1] : arguments[2];
    const o = typeof arguments[1] === "object" ? arguments[1] : {};
    if (o.timeout === undefined && defaults.timeout !== undefined) {
        o.timeout = defaults.timeout;
    }
    globals.Deno.test({
        name,
        ignore: o.skip,
        // deno-lint-ignore no-explicit-any
        fn: async (ctx) => {
            let test = void (0);
            let close = () => { };
            let closeTimeout = () => { };
            const done = new Promise((resolve, reject) => {
                let closed = false;
                close = () => {
                    if (closed) {
                        return;
                    }
                    closed = true;
                    resolve(0);
                };
                test = fn(ctx, (e) => {
                    if (closed) {
                        return;
                    }
                    closed = true;
                    if (e) {
                        reject(e);
                    }
                    else {
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
                }
                else {
                    await raceTask;
                }
            }
            finally {
                closeTimeout();
                close();
            }
        },
    });
}
