// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

/**
 * A parsed path object generated by path.parse() or consumed by path.format().
 *
 * @example
 * ```ts
 * import { parse } from "@hyprx/path";
 *
 * const parsedPathObj = parse("c:\\path\\dir\\index.html");
 * parsedPathObj.root; // "c:\\"
 * parsedPathObj.dir; // "c:\\path\\dir"
 * parsedPathObj.base; // "index.html"
 * parsedPathObj.ext; // ".html"
 * parsedPathObj.name; // "index"
 * ```
 */
export interface ParsedPath {
    /**
     * The root of the path such as '/' or 'c:\'
     */
    root: string;
    /**
     * The full directory path of the parent such as '/home/user/dir' or 'c:\path\dir'
     */
    dir: string;
    /**
     * The file name including extension (if any) such as 'index.html'
     */
    base: string;
    /**
     * The file extension (if any) such as '.html'
     */
    ext: string;
    /**
     * The file name without extension (if any) such as 'index'
     */
    name: string;
}
