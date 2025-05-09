// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { buildMessage } from "./internal/build-message.js";
import { diff } from "./internal/diff.js";
import { diffStr } from "./internal/diff-str.js";
import { format } from "./internal/format.js";
import { red } from "./internal/styles.js";
import { AssertionError } from "./assertion-error.js";
/**
 * Make an assertion that `actual` and `expected` are strictly equal, using
 * {@linkcode Object.is} for equality comparison. If not, then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { strictEquals } from "@hyprxassert";
 *
 * const a = {};
 * const b = a;
 * strictEquals(a, b); // Doesn't throw
 *
 * const c = {};
 * const d = {};
 * strictEquals(c, d); // Throws
 * ```
 *
 * @typeParam T The type of the expected value.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export function strictEquals(actual, expected, msg) {
  if (Object.is(actual, expected)) {
    return;
  }
  const msgSuffix = msg ? `: ${msg}` : ".";
  let message;
  const actualString = format(actual);
  const expectedString = format(expected);
  if (actualString === expectedString) {
    const withOffset = actualString
      .split("\n")
      .map((l) => `    ${l}`)
      .join("\n");
    message = `Values have the same structure but are not reference-equal${msgSuffix}\n\n${
      red(withOffset)
    }\n`;
  } else {
    const stringDiff = (typeof actual === "string") &&
      (typeof expected === "string");
    const diffResult = stringDiff
      ? diffStr(actual, expected)
      : diff(actualString.split("\n"), expectedString.split("\n"));
    const diffMsg = buildMessage(diffResult, { stringDiff }).join("\n");
    message = `Values are not strictly equal${msgSuffix}\n${diffMsg}`;
  }
  throw new AssertionError(message);
}
