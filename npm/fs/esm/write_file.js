/**
 * The `write-file` module provides functions to write binary data to a file.
 *
 * @module
 */
import "./_dnt.polyfills.js";
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn = undefined;
let createWriteStream = undefined;
let fnAsync = undefined;
/**
 * Writes binary data to a file.
 * @param path The path to the file.
 * @param data The binary data to write.
 * @param options The options for writing the file (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export function writeFile(path, data, options) {
  if (globals.Deno) {
    return globals.Deno.writeFile(path, data, options);
  }
  if (options?.signal && options?.signal.aborted) {
    const e = new Error("The operation was aborted.");
    e.name = "AbortError";
    return Promise.reject(e);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.writeFile;
    if (!fnAsync) {
      return Promise.reject(new Error("No suitable file system module found."));
    }
  }
  if (data instanceof ReadableStream) {
    if (!createWriteStream) {
      createWriteStream = loadFs()?.createWriteStream;
      if (!createWriteStream) {
        return Promise.reject(new Error("No suitable file system module found."));
      }
    }
    const sr = createWriteStream(path, { encoding: "utf8", flush: true, ...options });
    const writer = new WritableStream({
      write(chunk) {
        if (options?.signal) {
          options.signal.throwIfAborted();
        }
        if (chunk instanceof Uint8Array) {
          sr.write(chunk);
        } else if (chunk === null || chunk === undefined) {
          sr.end();
        }
      },
      close() {
        sr.close();
        sr.end();
      },
    });
    const wait = new Promise((resolve, reject) => {
      sr.on("error", (err) => {
        reject(err);
      });
      sr.on("finish", () => {
        resolve();
      });
    });
    return data.pipeTo(writer).then(() => wait);
  }
  const o = {};
  o.mode = options?.mode;
  o.flag = options?.append ? "a" : "w";
  if (options?.create) {
    o.flag += "+";
  }
  o.encoding = "utf8";
  if (options?.signal) {
    if (options?.signal && options?.signal.aborted) {
      const e = new Error("The operation was aborted.");
      e.name = "AbortError";
      return Promise.reject(e);
    }
    o.signal = options.signal;
  }
  return fnAsync(path, data, o);
}
/**
 * Synchronously writes binary data to a file.
 * @param path The path to the file.
 * @param data The binary data to write.
 * @param options The options for writing the file (optional).
 */
export function writeFileSync(path, data, options) {
  if (globals.Deno) {
    return globals.Deno.writeFileSync(path, data, options);
  }
  if (!fn) {
    fn = loadFs()?.writeFileSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  const o = {};
  o.mode = options?.mode;
  o.flag = options?.append ? "a" : "w";
  if (options?.create) {
    o.flag += "+";
  }
  o.encoding = "utf8";
  if (options?.signal) {
    options.signal.throwIfAborted();
    o.signal = options.signal;
  }
  return fn(path, data, o);
}
