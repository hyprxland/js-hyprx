/**
 * The `read-link` module provides functions to read the target of a symbolic link.
 *
 * @module
 */
import "./_dnt.polyfills.js";
/**
 * Reads the target of a symbolic link.
 * @param path The path to the symbolic link.
 * @returns A promise that resolves with the target path as a string.
 */
export declare function readLink(path: string | URL): Promise<string>;
/**
 * Synchronously reads the target of a symbolic link.
 * @param path The path to the symbolic link.
 * @returns The target path as a string.
 */
export declare function readLinkSync(path: string | URL): string;
