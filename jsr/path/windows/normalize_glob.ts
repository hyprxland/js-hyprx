// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import type { GlobOptions } from "../_common/glob_to_reg_exp.ts";
import { normalize } from "./normalize.ts";
import { SEPARATOR_PATTERN } from "./constants.ts";

export type { GlobOptions };

/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@hyprx/path/windows/normalize-glob";
 * import { equal } from "@hyprx/assert";
 *
 * const normalized = normalizeGlob("**\\foo\\..\\bar", { globstar: true });
 * equal(normalized, "**\\bar");
 * ```
 *
 * @param glob The glob pattern to normalize.
 * @param options The options for glob pattern.
 * @throws Error if the glob contains invalid characters.
 * @returns The normalized glob pattern.
 */
export function normalizeGlob(
    glob: string,
    options: Pick<GlobOptions, "globstar"> = {},
): string {
    const { globstar = false }: GlobOptions = options;
    if (glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
    }
    if (!globstar) {
        return normalize(glob);
    }
    const s = SEPARATOR_PATTERN.source;
    const badParentPattern = new RegExp(
        `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
        "g",
    );
    return normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
