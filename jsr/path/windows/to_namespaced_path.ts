// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import {
    CHAR_BACKWARD_SLASH,
    CHAR_COLON,
    CHAR_DOT,
    CHAR_QUESTION_MARK,
} from "@hyprx/chars/constants";
import { isWindowsDeviceRoot } from "./_util.ts";
import { resolve } from "./resolve.ts";

/**
 * Resolves path to a namespace path
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@hyprx/path/windows/to-namespaced-path";
 * import { equal } from "@hyprx/assert";
 *
 * const namespaced = toNamespacedPath("C:\\foo\\bar");
 * equal(namespaced, "\\\\?\\C:\\foo\\bar");
 * ```
 *
 * @param path The path to resolve to namespaced path
 * @returns The resolved namespaced path
 */
export function toNamespacedPath(path: string): string {
    // Note: this will *probably* throw somewhere.
    if (typeof path !== "string") return path;
    if (path.length === 0) return "";

    const resolvedPath = resolve(path);

    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
            // Possible UNC root

            if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
                const code = resolvedPath.charCodeAt(2);
                if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
                    // Matched non-long UNC root, convert the path to a long UNC path
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
            // Possible device root

            if (
                resolvedPath.charCodeAt(1) === CHAR_COLON &&
                resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH
            ) {
                // Matched device root, convert the path to a long UNC path
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }

    return path;
}
