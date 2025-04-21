import { test } from "./mod.ts";

if (test === undefined) {
    throw new Error("Test not found");
}

test("test::no async", () => {
    let x = 0;
    x++;
    if (x !== 1) {
        throw new Error("x should be 1");
    }
});

test("test::async", async () => {
    const p = new Promise((resolve) => {
        const handle = setTimeout(() => {
            clearTimeout(handle);
            resolve(0);
        }, 1000);
    });

    await p;
});

test("test::done", { done: true }, (_, done) => {
    let finished = false;
    const handle = setTimeout(() => {
        finished = true;
    }, 10000);

    if (finished) {
        throw new Error("Finished should be false");
    }

    clearTimeout(handle);
    done();
});

test("test::timeout", { timeout: 1000, skip: true }, () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    });
});
