import { test } from "@hyprx/testing";
import { equal, ok, rejects } from "@hyprx/assert";
import { readFile, readFileSync } from "./read_file.ts";
import { join } from "@hyprx/path";
import { makeDir } from "./make_dir.ts";
import { remove } from "./remove.ts";
import { writeTextFile } from "./write_text_file.ts";

const testData = join(import.meta.dirname!, "test-data", "read_file");

test("fs::readFile reads file contents", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test.txt");
    const content = "test content";

    try {
        await writeTextFile(filePath, content);
        const data = await readFile(filePath);
        ok(data instanceof Uint8Array);
        equal(new TextDecoder().decode(data).trim(), content);
    } finally {
        await remove(filePath);
    }
});

test("fs::readFile with aborted signal rejects", async () => {
    const controller = new AbortController();
    controller.abort();
    await rejects(
        () => readFile("test.txt", { signal: controller.signal }),
        Error,
    );
});

test("fs::readFileSync reads file contents", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test-sync.txt");
    const content = "test sync content";

    try {
        await writeTextFile(filePath, content);
        const data = readFileSync(filePath);
        ok(data instanceof Uint8Array);
        equal(new TextDecoder().decode(data).trim(), content);
    } finally {
        await remove(filePath);
    }
});
