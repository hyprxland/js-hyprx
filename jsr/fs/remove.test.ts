import { test } from "@hyprx/testing";
import { ok, rejects, throws } from "@hyprx/assert";
import { remove, removeSync } from "./remove.ts";
import { join } from "@hyprx/path";
import { globals } from "./globals.ts";
import { exists } from "./exists.ts";
import { makeDir } from "./make_dir.ts";
import { writeTextFile } from "./write_text_file.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data", "remove");

test("fs::remove deletes a file", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test1.txt");

    try {
        await writeTextFile(filePath, "test content");
        await remove(filePath);
        const e = await exists(filePath);
        ok(!e, "File should be deleted");
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::removeSync deletes a file", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test2.txt");

    try {
        await writeTextFile(filePath, "test content");
        removeSync(filePath);
        const e = await exists(filePath);
        ok(!e, "File should be deleted");
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::remove with non-existent file throws error", async () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    await rejects(() => remove(nonExistentPath));
});

test("fs::removeSync with non-existent file throws error", () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    throws(() => removeSync(nonExistentPath));
});

test("fs::remove uses Deno.remove when available", async () => {
    const { Deno: originalDeno } = globals;
    let removeCalled = false;
    delete g["Deno"];

    try {
        g.Deno = {
            remove: () => {
                removeCalled = true;
                return Promise.resolve();
            },
        };

        await remove("test.txt");
        ok(removeCalled, "Deno.remove should be called");
    } finally {
        globals.Deno = originalDeno;
    }
});

test("fs::removeSync uses Deno.removeSync when available", () => {
    const { Deno: originalDeno } = globals;
    delete g["Deno"];
    let removeSyncCalled = false;

    try {
        g.Deno = {
            removeSync: () => {
                removeSyncCalled = true;
            },
        };

        removeSync("test.txt");
        ok(removeSyncCalled, "Deno.removeSync should be called");
    } finally {
        globals.Deno = originalDeno;
    }
});
