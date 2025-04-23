import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal, rejects } from "@hyprx/assert";
import { writeFile, writeFileSync } from "./write_file.js";
import { join } from "@hyprx/path";
import { readTextFile } from "./read_text_file.js";
import { makeDir } from "./make_dir.js";
import { remove } from "./remove.js";
const testData = join(import.meta.dirname, "test-data", "write_file");
test("fs::writeFile writes data to a file", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "test.txt");
  const content = new TextEncoder().encode("test content");
  try {
    await writeFile(filePath, content);
    const result = await readTextFile(filePath);
    equal(result, "test content");
  } finally {
    await remove(filePath);
  }
});
test("fs::writeFile appends data when append option is true", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "append.txt");
  const content1 = new TextEncoder().encode("first ");
  const content2 = new TextEncoder().encode("second");
  try {
    await writeFile(filePath, content1);
    await writeFile(filePath, content2, { append: true });
    const result = await readTextFile(filePath);
    equal(result, "first second");
  } finally {
    await remove(filePath);
  }
});
test("fs::writeFile handles ReadableStream input", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "stream.txt");
  const content = "stream content";
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(content));
      controller.close();
    },
  });
  try {
    await writeFile(filePath, stream);
    const result = await readTextFile(filePath);
    equal(result, content);
  } finally {
    await remove(filePath);
  }
});
test("fs::writeFileSync writes data to a file synchronously", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "sync.txt");
  const content = new TextEncoder().encode("sync content");
  try {
    writeFileSync(filePath, content);
    const result = await readTextFile(filePath);
    equal(result, "sync content");
  } finally {
    await remove(filePath);
  }
});
test("fs::writeFile handles abort signal", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "abort.txt");
  const content = new TextEncoder().encode("abort content");
  const controller = new AbortController();
  try {
    controller.abort();
    await rejects(
      async () => await writeFile(filePath, content, { signal: controller.signal }),
      Error,
    );
  } finally {
    await remove(testData, { recursive: true });
  }
});
