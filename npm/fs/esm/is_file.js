/**
 * The `is-file` module provides functions to check if a given path is a file.
 *
 * @module
 */
import "./_dnt.polyfills.js";
import { stat, statSync } from "./stat.js";
/**
 * Checks if a path is a file.
 * @param path The path to check.
 * @returns A promise that resolves with a boolean indicating whether the path is a file.
 * @description
 * This function checks if a given path is a file. It returns true if the path is a file, and false otherwise.
 * Since it uses a try/catch internally, this should not be used in a loop where performance is critical.
 * @example
 * ```ts
 * import { isFile } from "@hyprx/fs/is-file";
 * async function checkFile() {
 *    try {
 *        const result = await isFile("example.txt");
 *        console.log(`Is it a file? ${result}`);
 *    } catch (error) {
 *        console.error("Error checking file:", error);
 *    }
 * }
 * checkFile();
 * ```
 */
export function isFile(path) {
  return stat(path)
    .then((stat) => stat.isFile)
    .catch(() => false);
}
/**
 * Synchronously checks if a path is a file.
 * @param path The path to check.
 * @returns A boolean indicating whether the path is a file.
 * @description
 * This function checks if a given path is a file. It returns true if the path is a file, and false otherwise.
 * Since it uses a try/catch internally, this should not be used in a loop where performance is critical.
 * @example
 * ```ts
 * import { isFileSync } from "@hyprx/fs/is-file";
 * function checkFile() {
 *     try {
 *         const result = isFileSync("example.txt");
 *         console.log(`Is it a file? ${result}`);
 *     } catch (error) {
 *         console.error("Error checking file:", error);
 *     }
 * }
 * checkFile();
 * ```
 */
export function isFileSync(path) {
  try {
    return statSync(path).isFile;
  } catch {
    return false;
  }
}
