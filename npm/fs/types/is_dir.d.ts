/**
 * The `is-dir` module provides functions to check if a given path is a directory.
 *
 * @module
 */
import "./_dnt.polyfills.js";
/**
 * Checks if a path is a directory asynchronously.
 * @description
 * This function checks if a given path is a directory. It returns true if the path is a directory, and false otherwise.
 * Since it uses a try/catch internally, this should not be used in a loop where performance is critical.
 * @param path The path to check.
 * @returns A promise that resolves with a boolean indicating whether the path is a directory.
 * @example
 * ```ts
 * import { isDir } from "@hyprx/fs/is-dir";
 * async function checkDirectory() {
 *     try {
 *         const result = await isDir("example_directory");
 *         console.log(`Is it a directory? ${result}`);
 *     } catch (error) {
 *         console.error("Error checking directory:", error);
 *     }
 * }
 * checkDirectory();
 * ```
 */
export declare function isDir(path: string | URL): Promise<boolean>;
/**
 * Synchronously checks if a path is a directory.
 * @description
 * This function checks if a given path is a directory. It returns true if the path is a directory, and false otherwise.
 * Since it uses a try/catch internally, this should not be used in a loop where performance is critical.
 * @param path The path to check.
 * @returns A boolean indicating whether the path is a directory.
 * @example
 * ```ts
 * import { isDirSync } from "@hyprx/fs/is-dir";
 * function checkDirectory() {
 *     try {
 *         const result = isDirSync("example_directory");
 *         console.log(`Is it a directory? ${result}`);
 *     } catch (error) {
 *         console.error("Error checking directory:", error);
 *     }
 * }
 * checkDirectory();
 * ```
 */
export declare function isDirSync(path: string | URL): boolean;
