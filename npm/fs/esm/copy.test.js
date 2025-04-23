// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal, ok, rejects, throws } from "@hyprx/assert";
import * as path from "@hyprx/path";
import { copy, copySync } from "./copy.js";
import { existsSync } from "./exists.js";
import { ensureDir, ensureDirSync } from "./ensure_dir.js";
import { ensureFile, ensureFileSync } from "./ensure_file.js";
import { ensureSymlink, ensureSymlinkSync } from "./ensure_symlink.js";
import { lstat, lstatSync } from "./lstat.js";
import { stat, statSync } from "./stat.js";
import { remove, removeSync } from "./remove.js";
import { writeTextFile } from "./write_text_file.js";
import { readTextFile } from "./read_text_file.js";
import { readFileSync } from "./read_file.js";
import { makeTempDir, makeTempDirSync } from "./make_temp_dir.js";
import { writeFileSync } from "./write_file.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
function testCopy(name, cb, ignore = false) {
  test(name, { skip: ignore }, async () => {
    const tempDir = await makeTempDir({
      prefix: "deno_std_copy_async_test_",
    });
    await cb(tempDir);
    await remove(tempDir, { recursive: true });
  });
}
function testCopySync(name, cb) {
  test(name, () => {
    const tempDir = makeTempDirSync({
      prefix: "deno_std_copy_sync_test_",
    });
    try {
      cb(tempDir);
    } finally {
      removeSync(tempDir, { recursive: true });
    }
  });
}
testCopy("fs::copy() rejects if src does not exist", async (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file_not_exists.txt");
  const destFile = path.join(tempDir, "copy_file_not_exists_1.txt");
  await rejects(async () => {
    await copy(srcFile, destFile);
  });
});
testCopy("fs::copy() rejects if src and dest are the same paths", async (tempDir) => {
  const srcFile = path.join(tempDir, "copy_file_same.txt");
  const destFile = path.join(tempDir, "copy_file_same.txt");
  await rejects(
    async () => {
      await copy(srcFile, destFile);
    },
    Error,
    "Source and destination cannot be the same.",
  );
});
testCopy("fs::copy() copies file to new destination", async (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy.txt");
  const srcContent = await readTextFile(srcFile);
  ok(await lstat(srcFile), "source should exist before copy");
  await rejects(async () => await lstat(destFile), "destination should not exist before copy");
  await copy(srcFile, destFile);
  ok(await lstat(srcFile), "source should exist after copy");
  ok(await lstat(destFile), "destination should exist after copy");
  const destContent = await readTextFile(destFile);
  equal(srcContent, destContent, "source and destination should have the same content");
  // Copy again and it should throw an error.
  await rejects(
    async () => {
      await copy(srcFile, destFile);
    },
    Error,
    `'${destFile}' already exists.`,
  );
  // Modify destination file.
  await writeTextFile(destFile, "txt copy");
  equal(await readTextFile(destFile), "txt copy");
  // Copy again with overwrite option.
  await copy(srcFile, destFile, { overwrite: true });
  // Make sure the file has been overwritten.
  equal(await readTextFile(destFile), "txt");
});
testCopy("fs::copy() copies with preserve timestamps", async (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy.txt");
  const srcStatInfo = await stat(srcFile);
  ok(srcStatInfo.atime instanceof Date);
  ok(srcStatInfo.mtime instanceof Date);
  // Copy with overwrite and preserve timestamps options.
  await copy(srcFile, destFile, {
    overwrite: true,
    preserveTimestamps: true,
  });
  const destStatInfo = await stat(destFile);
  ok(destStatInfo.atime instanceof Date);
  ok(destStatInfo.mtime instanceof Date);
  equal(destStatInfo.atime, srcStatInfo.atime);
  equal(destStatInfo.mtime, srcStatInfo.mtime);
});
testCopy("fs::copy() rejects if destination is its own subdirectory", async (tempDir) => {
  const srcDir = path.join(tempDir, "parent");
  const destDir = path.join(srcDir, "child");
  await ensureDir(srcDir);
  await rejects(
    async () => {
      await copy(srcDir, destDir);
    },
    Error,
    `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
  );
});
testCopy(
  "fs::copy() rejects when copying a directory to an existent destination that is not a directory",
  async (tempDir) => {
    const srcDir = path.join(tempDir, "parent");
    const destDir = path.join(tempDir, "child.txt");
    await ensureDir(srcDir);
    await ensureFile(destDir);
    await rejects(
      async () => {
        await copy(srcDir, destDir);
      },
      Error,
      `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`,
    );
  },
);
testCopy("fs::copy() copies a directory", async (tempDir) => {
  const srcDir = path.join(testdataDir, "copy_dir");
  const destDir = path.join(tempDir, "copy_dir");
  const srcFile = path.join(srcDir, "0.txt");
  const destFile = path.join(destDir, "0.txt");
  const srcNestFile = path.join(srcDir, "nest", "0.txt");
  const destNestFile = path.join(destDir, "nest", "0.txt");
  await copy(srcDir, destDir);
  ok(await lstat(destFile));
  ok(await lstat(destNestFile));
  // After copy. The source and destination should have the same content.
  equal(await readTextFile(srcFile), await readTextFile(destFile));
  equal(await readTextFile(srcNestFile), await readTextFile(destNestFile));
  // Copy again without overwrite option and it should throw an error.
  await rejects(
    async () => {
      await copy(srcDir, destDir);
    },
    Error,
    `'${destDir}' already exists.`,
  );
  // Modify the file in the destination directory.
  await writeTextFile(destNestFile, "nest copy");
  equal(await readTextFile(destNestFile), "nest copy");
  // Copy again with overwrite option.
  await copy(srcDir, destDir, { overwrite: true });
  // Make sure the file has been overwritten.
  equal(await readTextFile(destNestFile), "nest");
});
testCopy("fs::copy() copies a symlink file", async (tempDir) => {
  const dir = path.join(testdataDir, "copy_dir_link_file");
  const srcLink = path.join(dir, "0.txt");
  const destLink = path.join(tempDir, "0_copy.txt");
  ok((await lstat(srcLink)).isSymlink, `'${srcLink}' should be symlink type`);
  await copy(srcLink, destLink);
  const statInfo = await lstat(destLink);
  ok(statInfo.isSymlink, `'${destLink}' should be symlink type`);
});
testCopy("fs::copy() copies a symlink directory", async (tempDir) => {
  const srcDir = path.join(testdataDir, "copy_dir");
  const srcLink = path.join(tempDir, "copy_dir_link");
  const destLink = path.join(tempDir, "copy_dir_link_copy");
  await ensureSymlink(srcDir, srcLink);
  ok((await lstat(srcLink)).isSymlink, `'${srcLink}' should be symlink type`);
  await copy(srcLink, destLink);
  const statInfo = await lstat(destLink);
  ok(statInfo.isSymlink);
});
testCopySync("fs::copySync() throws if src does not exist", (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file_not_exists_sync.txt");
  const destFile = path.join(tempDir, "copy_file_not_exists_1_sync.txt");
  throws(() => {
    copySync(srcFile, destFile);
  });
});
testCopySync("fs::copySync() copies with preserve timestamps", (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy.txt");
  const srcStatInfo = statSync(srcFile);
  ok(srcStatInfo.atime instanceof Date);
  ok(srcStatInfo.mtime instanceof Date);
  // Copy with overwrite and preserve timestamps options.
  copySync(srcFile, destFile, {
    overwrite: true,
    preserveTimestamps: true,
  });
  const destStatInfo = statSync(destFile);
  ok(destStatInfo.atime instanceof Date);
  ok(destStatInfo.mtime instanceof Date);
  equal(destStatInfo.atime, srcStatInfo.atime);
  equal(destStatInfo.mtime, srcStatInfo.mtime);
});
testCopySync("fs::copySync() throws if src and dest are the same paths", () => {
  const srcFile = path.join(testdataDir, "copy_file_same_sync.txt");
  throws(
    () => {
      copySync(srcFile, srcFile);
    },
    Error,
    "Source and destination cannot be the same.",
  );
});
testCopySync("fs::copySync() copies file to new destination", (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy_sync.txt");
  const srcContent = new TextDecoder().decode(readFileSync(srcFile));
  equal(existsSync(srcFile), true);
  equal(existsSync(destFile), false);
  copySync(srcFile, destFile);
  equal(existsSync(srcFile), true);
  equal(existsSync(destFile), true);
  const destContent = new TextDecoder().decode(readFileSync(destFile));
  equal(srcContent, destContent);
  // Copy again without overwrite option and it should throw an error.
  throws(
    () => {
      copySync(srcFile, destFile);
    },
    Error,
    `'${destFile}' already exists.`,
  );
  // Modify destination file.
  writeFileSync(destFile, new TextEncoder().encode("txt copy"));
  equal(new TextDecoder().decode(readFileSync(destFile)), "txt copy");
  // Copy again with overwrite option.
  copySync(srcFile, destFile, { overwrite: true });
  // Make sure the file has been overwritten.
  equal(new TextDecoder().decode(readFileSync(destFile)), "txt");
});
testCopySync("fs::copySync() throws if destination is its own subdirectory", (tempDir) => {
  const srcDir = path.join(tempDir, "parent");
  const destDir = path.join(srcDir, "child");
  ensureDirSync(srcDir);
  throws(
    () => {
      copySync(srcDir, destDir);
    },
    Error,
    `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
  );
});
testCopySync(
  "fs::copySync() throws when copying a directory to an existent destination that is not a directory",
  (tempDir) => {
    const srcDir = path.join(tempDir, "parent_sync");
    const destDir = path.join(tempDir, "child.txt");
    ensureDirSync(srcDir);
    ensureFileSync(destDir);
    throws(
      () => {
        copySync(srcDir, destDir);
      },
      Error,
      `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`,
    );
  },
);
testCopySync("fs::copySync() copies a directory", (tempDir) => {
  const srcDir = path.join(testdataDir, "copy_dir");
  const destDir = path.join(tempDir, "copy_dir_copy_sync");
  const srcFile = path.join(srcDir, "0.txt");
  const destFile = path.join(destDir, "0.txt");
  const srcNestFile = path.join(srcDir, "nest", "0.txt");
  const destNestFile = path.join(destDir, "nest", "0.txt");
  copySync(srcDir, destDir);
  equal(existsSync(destFile), true);
  equal(existsSync(destNestFile), true);
  // After copy. The source and destination should have the same content.
  equal(
    new TextDecoder().decode(readFileSync(srcFile)),
    new TextDecoder().decode(readFileSync(destFile)),
  );
  equal(
    new TextDecoder().decode(readFileSync(srcNestFile)),
    new TextDecoder().decode(readFileSync(destNestFile)),
  );
  // Copy again without overwrite option and it should throw an error.
  throws(
    () => {
      copySync(srcDir, destDir);
    },
    Error,
    `'${destDir}' already exists.`,
  );
  // Modify the file in the destination directory.
  writeFileSync(destNestFile, new TextEncoder().encode("nest copy"));
  equal(new TextDecoder().decode(readFileSync(destNestFile)), "nest copy");
  // Copy again with overwrite option.
  copySync(srcDir, destDir, { overwrite: true });
  // Make sure the file has been overwritten.
  equal(new TextDecoder().decode(readFileSync(destNestFile)), "nest");
});
testCopySync("fs::copySync() copies symlink file", (tempDir) => {
  const dir = path.join(testdataDir, "copy_dir_link_file");
  const srcLink = path.join(dir, "0.txt");
  const destLink = path.join(tempDir, "0_copy.txt");
  ok(lstatSync(srcLink).isSymlink, `'${srcLink}' should be symlink type`);
  copySync(srcLink, destLink);
  const statInfo = lstatSync(destLink);
  ok(statInfo.isSymlink, `'${destLink}' should be symlink type`);
});
testCopySync("fs::copySync() copies symlink directory", (tempDir) => {
  const originDir = path.join(testdataDir, "copy_dir");
  const srcLink = path.join(tempDir, "copy_dir_link");
  const destLink = path.join(tempDir, "copy_dir_link_copy");
  ensureSymlinkSync(originDir, srcLink);
  ok(lstatSync(srcLink).isSymlink, `'${srcLink}' should be symlink type`);
  copySync(srcLink, destLink);
  const statInfo = lstatSync(destLink);
  ok(statInfo.isSymlink);
});
