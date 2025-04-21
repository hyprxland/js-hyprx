const importName = "bun:test";
const { test: bunTest } = await import(importName);
const { defaults } = await import("./globals.js");
export async function test() {
    const name = arguments[0];
    const fn = typeof arguments[1] === "function" ? arguments[1] : arguments[2];
    const o = typeof arguments[1] === "object" ? arguments[1] : {};
    if (o.timeout === undefined && defaults.timeout !== undefined) {
        o.timeout = defaults.timeout;
    }
    if (o.skip) {
        return await bunTest.skip(name, () => { });
    }
    return await bunTest(name, async () => {
        let test = void (0);
        let close = () => { };
        const done = new Promise((resolve, reject) => {
            let closed = false;
            close = () => {
                if (closed) {
                    return;
                }
                closed = true;
                resolve(0);
            };
            test = fn({}, (e) => {
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
            await raceTask;
        }
        finally {
            close();
        }
    }, o.timeout);
}
