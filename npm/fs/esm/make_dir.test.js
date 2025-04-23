import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal, ok, rejects } from "@hyprx/assert";
import { makeDir, makeDirSync } from "./make_dir.js";
import { join } from "@hyprx/path";
import { exec, output } from "./_testutils.js";
import { globals } from "./globals.js";
import { statSync } from "./stat.js";
import { removeSync } from "./remove.js";
// deno-lint-ignore no-explicit-any
const g = globals;
const testData = join(import.meta.dirname, "test-data", "make_dir");
test("fs::makeDir creates a directory", async () => {
  const dirPath = join(testData, "new-dir");
  await makeDir(testData, { recursive: true });
  try {
    await makeDir(dirPath);
    const o = await output("test", ["-d", dirPath]);
    equal(o.code, 0);
  } finally {
    await exec("rm", ["-rf", dirPath]);
  }
});
test("fs::makeDir throws when directory already exists", async () => {
  const dirPath = join(testData, "existing-dir");
  await makeDir(testData, { recursive: true });
  try {
    await makeDir(dirPath, { recursive: true });
    await rejects(async () => await makeDir(dirPath));
  } finally {
    await exec("rm", ["-rf", dirPath]);
  }
});
test("fs::makeDir uses Deno.mkdir when available", async () => {
  const { Deno: od } = globals;
  delete g["Deno"];
  try {
    let called = false;
    g.Deno = {
      mkdir: () => {
        called = true;
      },
    };
    await makeDir("test");
    ok(called);
  } finally {
    globals.Deno = od;
  }
});
test("fs::makeDirSync creates a directory synchronously", () => {
  const dirPath = join(testData, "new-dir-sync");
  try {
    makeDirSync(dirPath);
    const result = statSync(dirPath);
    ok(result.isDirectory);
  } finally {
    removeSync(dirPath, { recursive: true });
  }
});
test("fs::makeDirSync uses Deno.mkdirSync when available", () => {
  const { Deno: od } = globals;
  delete g["Deno"];
  try {
    let called = false;
    g.Deno = {
      mkdirSync: () => {
        called = true;
      },
    };
    makeDirSync("test");
    ok(called);
  } finally {
    globals.Deno = od;
  }
});
