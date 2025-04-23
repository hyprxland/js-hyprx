// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
/**
 * The `ensure-symlink` module provides functions to ensure that a symlink
 * exists.
 *
 * @module
 */
import "./_dnt.polyfills.js";
import { dirname } from "@hyprx/path/dirname";
import { resolve } from "@hyprx/path/resolve";
import { ensureDir, ensureDirSync } from "./ensure_dir.js";
import { getFileInfoType, toPathString } from "./utils.js";
import { AlreadyExistsError, isAlreadyExistsError } from "./errors.js";
import { lstat, lstatSync } from "./lstat.js";
import { readLink, readLinkSync } from "./read_link.js";
import { symlink, symlinkSync } from "./symlink.js";
import { WIN } from "./globals.js";
function resolveSymlinkTarget(target, linkName) {
  if (typeof target !== "string") {
    return target; // URL is always absolute path
  }
  if (typeof linkName === "string") {
    return resolve(dirname(linkName), target);
  } else {
    return new URL(target, linkName);
  }
}
/**
 * Asynchronously ensures that the link exists, and points to a valid file. If
 * the directory structure does not exist, it is created. If the link already
 * exists, it is not modified but error is thrown if it is not point to the
 * given target.
 *
 * Requires the `--allow-read` and `--allow-write` flag when using Deno.
 *
 * @param target The source file path as a string or URL.
 * @param linkName The destination link path as a string or URL.
 * @returns A void promise that resolves once the link exists.
 *
 * @example
 * ```ts
 * import { ensureSymlink } from "@hyprx/fs";
 *
 * await ensureSymlink("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
export async function ensureSymlink(target, linkName) {
  const targetRealPath = resolveSymlinkTarget(target, linkName);
  const srcStatInfo = await lstat(targetRealPath);
  const srcFilePathType = getFileInfoType(srcStatInfo);
  await ensureDir(dirname(toPathString(linkName)));
  const options = WIN
    ? {
      type: srcFilePathType === "dir" ? "dir" : "file",
    }
    : undefined;
  try {
    await symlink(target, linkName, options);
  } catch (error) {
    if (!(isAlreadyExistsError(error))) {
      throw error;
    }
    const linkStatInfo = await lstat(linkName);
    if (!linkStatInfo.isSymlink) {
      const type = getFileInfoType(linkStatInfo);
      throw new AlreadyExistsError(`A '${type}' already exists at the path: ${linkName}`);
    }
    const linkPath = await readLink(linkName);
    const linkRealPath = resolve(linkPath);
    if (linkRealPath !== targetRealPath) {
      throw new AlreadyExistsError(
        `A symlink targeting to an undesired path already exists: ${linkName} -> ${linkRealPath}`,
      );
    }
  }
}
/**
 * Synchronously ensures that the link exists, and points to a valid file. If
 * the directory structure does not exist, it is created. If the link already
 * exists, it is not modified but error is thrown if it is not point to the
 * given target.
 *
 * Requires the `--allow-read` and `--allow-write` flag when using Deno.
 *
 * @param target The source file path as a string or URL.
 * @param linkName The destination link path as a string or URL.
 * @returns A void value that returns once the link exists.
 *
 * @example
 * ```ts
 * import { ensureSymlinkSync } from "@hyprx/fs";
 *
 * ensureSymlinkSync("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
export function ensureSymlinkSync(target, linkName) {
  const targetRealPath = resolveSymlinkTarget(target, linkName);
  const srcStatInfo = lstatSync(targetRealPath);
  const srcFilePathType = getFileInfoType(srcStatInfo);
  ensureDirSync(dirname(toPathString(linkName)));
  const options = WIN
    ? {
      type: srcFilePathType === "dir" ? "dir" : "file",
    }
    : undefined;
  try {
    symlinkSync(target, linkName, options);
  } catch (error) {
    if (!(isAlreadyExistsError(error))) {
      throw error;
    }
    const linkStatInfo = lstatSync(linkName);
    if (!linkStatInfo.isSymlink) {
      const type = getFileInfoType(linkStatInfo);
      throw new AlreadyExistsError(`A '${type}' already exists at the path: ${linkName}`);
    }
    const linkPath = readLinkSync(linkName);
    const linkRealPath = resolve(linkPath);
    if (linkRealPath !== targetRealPath) {
      throw new AlreadyExistsError(
        `A symlink targeting to an undesired path already exists: ${linkName} -> ${linkRealPath}`,
      );
    }
  }
}
