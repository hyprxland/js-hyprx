// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import { normalizeString } from "../_common/normalize_string.ts";
import { assertPath } from "../_common/assert_path.ts";
import { isPosixPathSeparator } from "./_util.ts";
import { cwd } from "../globals.ts";

/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@hyprx/path/posix/resolve";
 * import { equal } from "@hyprx/assert";
 *
 * const path = resolve("/foo", "bar", "baz/asdf", "quux", "..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @param pathSegments The path segments to resolve.
 * @returns The resolved path.
 */
export function resolve(...pathSegments: string[]): string {
    let resolvedPath = "";
    let resolvedAbsolute = false;

    for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        let path: string;

        if (i >= 0) path = pathSegments[i]!;
        else {
            path = cwd();
        }

        assertPath(path);

        // Skip empty entries
        if (path.length === 0) {
            continue;
        }

        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = isPosixPathSeparator(path.charCodeAt(0));
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when cwd() fails)

    // Normalize the path
    resolvedPath = normalizeString(
        resolvedPath,
        !resolvedAbsolute,
        "/",
        isPosixPathSeparator,
    );

    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
