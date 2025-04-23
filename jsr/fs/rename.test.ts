import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { rename, renameSync } from "./rename.ts";
import { join } from "@hyprx/path";
import { makeDir } from "./make_dir.ts";
import { writeTextFile } from "./write_text_file.ts";
import { remove } from "./remove.ts";
import { readTextFile } from "./read_text_file.ts";

const testData = join(import.meta.dirname!, "test-data", "rename-test");

test("fs::rename renames a file", async () => {
    await makeDir(testData, { recursive: true });
    const oldPath = join(testData, "old.txt");
    const newPath = join(testData, "new.txt");
    const content = "test content";

    try {
        await writeTextFile(oldPath, content);
        await rename(oldPath, newPath);

        const renamedContent = await readTextFile(newPath);
        equal(renamedContent, content);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::renameSync renames a file", async () => {
    await makeDir(testData, { recursive: true });
    const oldPath = join(testData, "old-sync.txt");
    const newPath = join(testData, "new-sync.txt");
    const content = "test content sync";

    try {
        await writeTextFile(oldPath, content);
        renameSync(oldPath, newPath);

        const renamedContent = await readTextFile(newPath);
        equal(renamedContent, content);
    } finally {
        await remove(testData, { recursive: true });
    }
});
