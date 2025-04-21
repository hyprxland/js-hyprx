/**
 * Make an assertion that actual includes expected. If not
 * then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { stringIncludes } from "@hyprxassert";
 *
 * stringIncludes("Hello", "ello"); // Doesn't throw
 * stringIncludes("Hello", "world"); // Throws
 * ```
 *
 * @param actual The actual string to check for inclusion.
 * @param expected The expected string to check for inclusion.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function stringIncludes(actual: string, expected: string, msg?: string): void;
