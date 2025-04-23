import { test } from "@hyprx/testing";
import { equal, ok } from "@hyprx/assert";
import { makeTempFile, makeTempFileSync } from "./make_temp_file.ts";
import { join } from "@hyprx/path";
import { globals } from "./globals.ts";
import { makeDir } from "./make_dir.ts";
import { remove } from "./remove.ts";
import { exists, existsSync } from "./exists.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;
const testData = join(import.meta.dirname!, "test-data", "make_temp_file");

test("fs::makeTempFile creates a temporary file with default options", async () => {
    const file = await makeTempFile();
    console.log(file);
    ok(await exists(file), "File should exist");
    await remove(file);
});

test("fs::makeTempFile creates a file with custom prefix and suffix", async () => {
    const file = await makeTempFile({ prefix: "test-", suffix: ".txt" });
    ok(await exists(file));
    const tmp = globals.process.env.TEMP ?? globals.process.env.TMPDIR ?? "/tmp";
    ok(file.startsWith(join(tmp, "test-")));
    ok(file.endsWith(".txt"));
    await remove(file);
});

test("fs::makeTempFile creates a file in custom directory", async () => {
    const customDir = join(testData, "custom-temp");
    await makeDir(customDir, { recursive: true });
    const file = await makeTempFile({ dir: customDir });
    ok(await exists(file), `File ${file} should exist in ${customDir}`);
    ok(file.includes(customDir));
    await remove(customDir, { recursive: true });
});

test("fs::makeTempFileSync creates a temporary file with default options", async () => {
    const file = makeTempFileSync();
    ok(existsSync(file));
    await remove(file, { recursive: true });
});

test("fs::makeTempFileSync creates a file with custom prefix and suffix", async () => {
    const file = makeTempFileSync({ prefix: "test-", suffix: ".txt" });
    ok(existsSync(file));
    const tmp = globals.process.env.TEMP ?? globals.process.env.TMPDIR ?? "/tmp";
    ok(file.startsWith(join(tmp, "test-")));
    ok(file.endsWith(".txt"));
    await remove(file, { recursive: true });
});

test("fs::makeTempFileSync creates a file in custom directory", async () => {
    const customDir = join(testData, "custom-temp-sync");
    await makeDir(customDir, { recursive: true });
    const file = makeTempFileSync({ dir: customDir });
    ok(existsSync(file));
    ok(file.includes(customDir));
    await remove(customDir, { recursive: true });
});

test("fs::makeTempFile uses Deno.makeTempFile when available", async () => {
    const originalDeno = g.Deno;
    delete g["Deno"];
    const testFile = "/tmp/test-deno-file";
    try {
        g.Deno = {
            makeTempFile: () => Promise.resolve(testFile),
        };
        const file = await makeTempFile();
        equal(file, testFile);
    } finally {
        g.Deno = originalDeno;
    }
});

test("fs::makeTempFileSync uses Deno.makeTempFileSync when available", () => {
    const originalDeno = g.Deno;
    delete g["Deno"];
    const testFile = "/tmp/test-deno-file-sync";
    try {
        g.Deno = {
            makeTempFileSync: () => testFile,
        };
        const file = makeTempFileSync();
        equal(file, testFile);
    } finally {
        g.Deno = originalDeno;
    }
});
