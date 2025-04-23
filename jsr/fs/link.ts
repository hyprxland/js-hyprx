/**
 * The `link` module provides functions to create hard links to files.
 *
 * @module
 */

import { toPathString } from "./utils.ts";
import { globals, loadFs, loadFsAsync } from "./globals.ts";

let lk: typeof import("node:fs").linkSync | undefined;
let lkAsync: typeof import("node:fs/promises").link | undefined;

/**
 * Creates a hard link.
 * @param oldPath The path to the existing file.
 * @param newPath The path to the new link.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { link } from "@hyprx/fs/link";
 * async function createLink() : Promise<void> {
 *     try {
 *         await link("source.txt", "link.txt");
 *         console.log("Link created successfully.");
 *     } catch (error) {
 *         console.error("Error creating link:", error);
 *     }
 * }
 * await createLink();
 * ```
 */
export function link(oldPath: string | URL, newPath: string | URL): Promise<void> {
    if (globals.Deno) {
        return globals.Deno.link(toPathString(oldPath), toPathString(newPath));
    }

    if (!lkAsync) {
        lkAsync = loadFsAsync()?.link;
        if (!lkAsync) {
            return Promise.reject(new Error("No suitable file system module found."));
        }
    }

    return lkAsync(oldPath, newPath);
}

/**
 * Synchronously creates a hard link.
 * @param oldPath The path to the existing file.
 * @param newPath The path to the new link.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { linkSync } from "@hyprx/fs/link";
 * function createLink() {
 *   try {
 *      linkSync("source.txt", "link.txt");
 *      console.log("Link created successfully.");
 *   } catch (error) {
 *      console.error("Error creating link:", error);
 *   }
 * }
 * createLink();
 * ```
 */
export function linkSync(oldPath: string | URL, newPath: string | URL): void {
    if (globals.Deno) {
        return globals.Deno.linkSync(toPathString(oldPath), toPathString(newPath));
    }

    if (!lk) {
        lk = loadFs()?.linkSync;
        if (!lk) {
            throw new Error("No suitable file system module found.");
        }
    }

    lk(oldPath, newPath);
}
