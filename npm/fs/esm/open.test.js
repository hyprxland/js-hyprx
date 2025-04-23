var __addDisposableResource = (this && this.__addDisposableResource) ||
  function (env, value, async) {
    if (value !== null && value !== void 0) {
      if (typeof value !== "object" && typeof value !== "function") {
        throw new TypeError("Object expected.");
      }
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async) inner = dispose;
      }
      if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
      if (inner) {
        dispose = function () {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      }
      env.stack.push({ value: value, dispose: dispose, async: async });
    } else if (async) {
      env.stack.push({ async: true });
    }
    return value;
  };
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError
        ? new SuppressedError(e, env.error, "An error was suppressed during disposal.")
        : e;
      env.hasError = true;
    }
    function next() {
      while (env.stack.length) {
        var rec = env.stack.pop();
        try {
          var result = rec.dispose && rec.dispose.call(rec.value);
          if (rec.async) {
            return Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          }
        } catch (e) {
          fail(e);
        }
      }
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(
  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  },
);
import "./_dnt.test_polyfills.js";
import { test } from "@hyprx/testing";
import { equal, ok, rejects, throws } from "@hyprx/assert";
import { ext, open, openSync } from "./open.js";
import { join } from "@hyprx/path";
import { globals } from "./globals.js";
import { makeDir, makeDirSync } from "./make_dir.js";
import { writeTextFile, writeTextFileSync } from "./write_text_file.js";
import { remove, removeSync } from "./remove.js";
import { readTextFile, readTextFileSync } from "./read_text_file.js";
const testData = join(import.meta.dirname, "test-data", "open");
test("fs::open opens file with read access", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "read1.txt");
  const content = "test content";
  try {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      await writeTextFile(filePath, content);
      const file = __addDisposableResource(env_1, await open(filePath, { read: true }), false);
      ok(file.supports.includes("read"));
      const buffer = new Uint8Array(100);
      const bytesRead = await file.read(buffer);
      ok(bytesRead !== null);
      const text = new TextDecoder().decode(buffer.subarray(0, bytesRead));
      equal(text.trim(), content);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources(env_1);
    }
  } finally {
    await remove(filePath);
  }
});
test("fs::open opens file with write access", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "write.txt");
  const content = "test write content";
  try {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const file = __addDisposableResource(
        env_2,
        await open(filePath, { write: true, create: true }),
        false,
      );
      ok(file.supports.includes("write"));
      const buffer = new TextEncoder().encode(content);
      const bytesWritten = await file.write(buffer);
      equal(bytesWritten, buffer.length);
      const fileContent = await readTextFile(filePath);
      equal(fileContent, content);
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources(env_2);
    }
  } finally {
    await remove(filePath);
  }
});
test("fs::openSync opens file with read access", () => {
  makeDirSync(testData, { recursive: true });
  const filePath = join(testData, "read-sync.txt");
  const content = "test sync content";
  try {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      writeTextFileSync(filePath, content);
      const file = __addDisposableResource(env_3, openSync(filePath, { read: true }), false);
      ok(file.supports.includes("read"));
      const buffer = new Uint8Array(100);
      const bytesRead = file.readSync(buffer);
      ok(bytesRead !== null);
      const text = new TextDecoder().decode(buffer.subarray(0, bytesRead));
      equal(text.trim(), content);
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources(env_3);
    }
  } finally {
    removeSync(filePath);
  }
});
test("fs::openSync opens file with write access", () => {
  makeDirSync(testData, { recursive: true });
  const filePath = join(testData, "write-sync.txt");
  const content = "test sync write content";
  try {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
      const file = __addDisposableResource(
        env_4,
        openSync(filePath, { write: true, create: true }),
        false,
      );
      ok(file.supports.includes("write"));
      const buffer = new TextEncoder().encode(content);
      const bytesWritten = file.writeSync(buffer);
      equal(bytesWritten, buffer.length);
      const fileContent = readTextFileSync(filePath);
      equal(fileContent.trim(), content);
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      __disposeResources(env_4);
    }
  } finally {
    removeSync(filePath);
  }
});
test("fs::open throws error when file doesn't exist", async () => {
  const nonExistentPath = join(testData, "non-existent.txt");
  await rejects(() => open(nonExistentPath, { read: true }));
});
test("fs::openSync throws error when file doesn't exist", () => {
  const nonExistentPath = join(testData, "non-existent.txt");
  throws(() => openSync(nonExistentPath, { read: true }));
});
test("fs::open file supports lock operations", {
  skip: globals.Deno === undefined && !ext.lockSupported,
}, async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "lock.txt");
  try {
    const env_5 = { stack: [], error: void 0, hasError: false };
    try {
      const file = __addDisposableResource(
        env_5,
        await open(filePath, { write: true, create: true }),
        false,
      );
      ok(file.supports.includes("lock"));
      await file.lock();
      await file.unlock();
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      __disposeResources(env_5);
    }
  } finally {
    await remove(filePath);
  }
});
test("fs::open file supports seek operations", {
  skip: globals.Deno === undefined && !ext.seekSupported,
}, async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "seek.txt");
  const content = "test seek content";
  try {
    const env_6 = { stack: [], error: void 0, hasError: false };
    try {
      await writeTextFile(filePath, content);
      const file = __addDisposableResource(env_6, await open(filePath, { read: true }), false);
      ok(file.supports.includes("seek"));
      await file.seek(5, "start");
      const buffer = new Uint8Array(100);
      const bytesRead = await file.read(buffer);
      ok(bytesRead !== null);
      const text = new TextDecoder().decode(buffer.subarray(0, bytesRead));
      equal(text.trim(), content.slice(5));
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      __disposeResources(env_6);
    }
  } finally {
    await remove(filePath);
  }
});
test("fs::open file supports stat operations", async () => {
  await makeDir(testData, { recursive: true });
  const filePath = join(testData, "stat.txt");
  const content = "test stat content";
  try {
    const env_7 = { stack: [], error: void 0, hasError: false };
    try {
      await writeTextFile(filePath, content);
      const file = __addDisposableResource(env_7, await open(filePath, { read: true }), false);
      const stat = await file.stat();
      ok(stat.isFile);
      equal(stat.size, content.length);
      ok(stat.mtime instanceof Date);
      ok(stat.atime instanceof Date);
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      __disposeResources(env_7);
    }
  } finally {
    await remove(filePath);
  }
});
