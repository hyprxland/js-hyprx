// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// TODO(axetroy): Add test for Windows once symlink is implemented for Windows.\
import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal, rejects, throws } from "@hyprx/assert";
import * as path from "@hyprx/path";
import { ensureLink, ensureLinkSync } from "./ensure_link.js";
import { lstat, lstatSync } from "./lstat.js";
import { makeDir, makeDirSync } from "./make_dir.js";
import { remove, removeSync } from "./remove.js";
import { writeFile, writeFileSync } from "./write_file.js";
import { writeTextFile } from "./write_text_file.js";
import { readTextFile } from "./read_text_file.js";
import { readFileSync } from "./read_file.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
test("fs::ensureLink() rejects if src and dest do not exist", async function () {
  const srcDir = path.join(testdataDir, "ensure_link_1");
  const destDir = path.join(testdataDir, "ensure_link_1_2");
  const testFile = path.join(srcDir, "test.txt");
  const linkFile = path.join(destDir, "link.txt");
  await rejects(async () => {
    await ensureLink(testFile, linkFile);
  });
  await remove(destDir, { recursive: true });
});
test("fs::ensureLinkSync() throws if src and dest do not exist", function () {
  const testDir = path.join(testdataDir, "ensure_link_2");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  throws(() => {
    ensureLinkSync(testFile, linkFile);
  });
  removeSync(testDir, { recursive: true });
});
test("fs::ensureLink() ensures dest links to the src", async function () {
  const testDir = path.join(testdataDir, "ensure_link_3");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  await makeDir(testDir, { recursive: true });
  await writeFile(testFile, new Uint8Array());
  await ensureLink(testFile, linkFile);
  const srcStat = await lstat(testFile);
  const linkStat = await lstat(linkFile);
  equal(srcStat.isFile, true);
  equal(linkStat.isFile, true);
  // har link success. try to change one of them. they should be change both.
  // let's change origin file.
  await writeTextFile(testFile, "123");
  const testFileContent1 = await readTextFile(testFile);
  const linkFileContent1 = await readTextFile(testFile);
  equal(testFileContent1, "123");
  equal(testFileContent1, linkFileContent1);
  // let's change link file.
  await writeFile(testFile, new TextEncoder().encode("abc"));
  const testFileContent2 = await readTextFile(testFile);
  const linkFileContent2 = await readTextFile(testFile);
  equal(testFileContent2, "abc");
  equal(testFileContent2, linkFileContent2);
  await remove(testDir, { recursive: true });
});
test("fs::ensureLinkSync() ensures dest links to the src", function () {
  const testDir = path.join(testdataDir, "ensure_link_4");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  makeDirSync(testDir, { recursive: true });
  writeFileSync(testFile, new Uint8Array());
  ensureLinkSync(testFile, linkFile);
  const srcStat = lstatSync(testFile);
  const linkStat = lstatSync(linkFile);
  equal(srcStat.isFile, true);
  equal(linkStat.isFile, true);
  // har link success. try to change one of them. they should be change both.
  // let's change origin file.
  writeFileSync(testFile, new TextEncoder().encode("123"));
  const testFileContent1 = new TextDecoder().decode(readFileSync(testFile));
  const linkFileContent1 = new TextDecoder().decode(readFileSync(testFile));
  equal(testFileContent1, "123");
  equal(testFileContent1, linkFileContent1);
  // let's change link file.
  writeFileSync(testFile, new TextEncoder().encode("abc"));
  const testFileContent2 = new TextDecoder().decode(readFileSync(testFile));
  const linkFileContent2 = new TextDecoder().decode(readFileSync(testFile));
  equal(testFileContent2, "abc");
  equal(testFileContent2, linkFileContent2);
  removeSync(testDir, { recursive: true });
});
test("fs::ensureLink() rejects if link does not exist", async function () {
  const testDir = path.join(testdataDir, "ensure_link_origin_3");
  const linkDir = path.join(testdataDir, "ensure_link_link_3");
  const testFile = path.join(testDir, "test.txt");
  await makeDir(testDir, { recursive: true });
  await writeFile(testFile, new Uint8Array());
  await rejects(async () => {
    await ensureLink(testDir, linkDir);
  });
  await remove(testDir, { recursive: true });
});
test("fs::ensureLinkSync() throws if link does not exist", function () {
  const testDir = path.join(testdataDir, "ensure_link_origin_3");
  const linkDir = path.join(testdataDir, "ensure_link_link_3");
  const testFile = path.join(testDir, "test.txt");
  makeDirSync(testDir, { recursive: true });
  writeFileSync(testFile, new Uint8Array());
  throws(() => {
    ensureLinkSync(testDir, linkDir);
  });
  removeSync(testDir, { recursive: true });
});
