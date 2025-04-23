import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { isFile, isFileSync } from "./is_file.ts";
import { join } from "@hyprx/path";
import { makeDir, makeDirSync } from "./make_dir.ts";
import { writeTextFile } from "./write_text_file.ts";
import { remove } from "./remove.ts";

const testData = join(import.meta.dirname!, "test-data", "is_file");

test("fs::isFile returns true for existing file", async () => {
    await makeDir(testData, { recursive: true });
    const filePath = join(testData, "test.txt");

    try {
        await writeTextFile(filePath, "test content");
        const result = await isFile(filePath);
        equal(result, true);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::isFile returns false for directory", async () => {
    await makeDir(testData, { recursive: true });
    try {
        const result = await isFile(testData);
        equal(result, false);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::isFile returns false for non-existent path", async () => {
    const result = await isFile("non-existent-file.txt");
    equal(result, false);
});

test("fs::isFileSync returns true for existing file", async () => {
    await makeDirSync(testData, { recursive: true });
    const filePath = join(testData, "test.txt");

    try {
        await writeTextFile(filePath, "test content");
        const result = isFileSync(filePath);
        equal(result, true);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::isFileSync returns false for directory", async () => {
    makeDirSync(testData, { recursive: true });
    try {
        const result = isFileSync(testData);
        equal(result, false);
    } finally {
        await remove(testData, { recursive: true });
    }
});

test("fs::isFileSync returns false for non-existent path", () => {
    const result = isFileSync("non-existent-file.txt");
    equal(result, false);
});
