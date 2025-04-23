import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { symlink, symlinkSync } from "./symlink.js";
import { join } from "@hyprx/path";
import { writeTextFile } from "./write_text_file.js";
import { remove } from "./remove.js";
import { makeDir } from "./make_dir.js";
import { readTextFile } from "./read_text_file.js";
const testData = join(import.meta.dirname, "test-data", "symlink");
test("fs::symlink creates a symbolic link to a file", async () => {
  await makeDir(testData, { recursive: true });
  const sourcePath = join(testData, "source1.txt");
  const linkPath = join(testData, "link1.txt");
  const content = "test content";
  try {
    await writeTextFile(sourcePath, content);
    await symlink(sourcePath, linkPath);
    const linkedContent = await readTextFile(linkPath);
    equal(linkedContent, content);
  } finally {
    await remove(testData, { recursive: true });
  }
});
test("fs::symlinkSync creates a symbolic link to a file", async () => {
  await makeDir(testData, { recursive: true });
  const sourcePath = join(testData, "source2.txt");
  const linkPath = join(testData, "link2.txt");
  const content = "test content sync";
  try {
    await writeTextFile(sourcePath, content);
    symlinkSync(sourcePath, linkPath);
    const linkedContent = await readTextFile(linkPath);
    equal(linkedContent, content);
  } finally {
    await remove(testData, { recursive: true });
  }
});
