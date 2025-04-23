import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { chmod, chmodSync } from "./chmod.js";
import { join } from "@hyprx/path";
import { WIN } from "./globals.js";
import { exec } from "./_testutils.js";
import { stat } from "./stat.js";
import { ensureFile, ensureFileSync } from "./ensure_file.js";
const testFile = join(import.meta.dirname, "chmod_test.txt");
test("fs::chmod changes permissions async", { skip: WIN }, async () => {
  await ensureFile(testFile);
  try {
    await exec("chmod", ["644", testFile]);
    await chmod(testFile, 0o755);
    const o = await stat(testFile);
    // 0o755 in octal = 493 in decimal
    equal(o.mode & 0o777, 0o755);
  } finally {
    await exec("rm", [testFile]);
  }
});
test("fs::chmodSync changes permissions sync", { skip: WIN }, async () => {
  ensureFileSync(testFile);
  try {
    await exec("chmod", ["644", testFile]);
    chmodSync(testFile, 0o755);
    const o = await stat(testFile);
    // 0o755 in octal = 493 in decimal
    equal(o.mode & 0o777, 0o755);
  } finally {
    await exec("rm", [testFile]);
  }
});
