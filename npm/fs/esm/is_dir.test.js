import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { isDir, isDirSync } from "./is_dir.js";
import { join } from "@hyprx/path";
import { makeDir } from "./make_dir.js";
import { ensureFile } from "./ensure_file.js";
import { remove } from "./remove.js";
const testData = join(import.meta.dirname, "test-data", "is_dir");
test("fs::isDir returns true for existing directory", async () => {
  await makeDir(testData, { recursive: true });
  try {
    const result = await isDir(testData);
    equal(result, true);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::isDir returns false for non-existent path", async () => {
  const nonExistentPath = join(testData, "non-existent");
  const result = await isDir(nonExistentPath);
  equal(result, false);
});
test("fs::isDir returns false for file", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test.txt");
  try {
    await ensureFile(filePath);
    const result = await isDir(filePath);
    equal(result, false);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::isDirSync returns true for existing directory", async () => {
  await makeDir(testData, { recursive: true });
  try {
    const result = isDirSync(testData);
    equal(result, true);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::isDirSync returns false for non-existent path", () => {
  const nonExistentPath = join(testData, "non-existent");
  const result = isDirSync(nonExistentPath);
  equal(result, false);
});
test("fs::isDirSync returns false for file", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test.txt");
  try {
    await ensureFile(filePath);
    const result = isDirSync(filePath);
    equal(result, false);
  } finally {
    await remove(testData, { recursive: true });
  }
});
