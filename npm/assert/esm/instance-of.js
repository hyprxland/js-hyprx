// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.js";
/**
 * Make an assertion that `obj` is an instance of `type`.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { assertInstanceOf } from "@std/assert";
 *
 * assertInstanceOf(new Date(), Date); // Doesn't throw
 * assertInstanceOf(new Date(), Number); // Throws
 * ```
 *
 * @typeParam T The expected type of the object.
 * @param actual The object to check.
 * @param expectedType The expected class constructor.
 * @param msg The optional message to display if the assertion fails.
 */
export function instanceOf(actual, expectedType, msg = "") {
  if (actual instanceof expectedType) {
    return;
  }
  const msgSuffix = msg ? `: ${msg}` : ".";
  const expectedTypeStr = expectedType.name;
  let actualTypeStr = "";
  if (actual === null) {
    actualTypeStr = "null";
  } else if (actual === undefined) {
    actualTypeStr = "undefined";
  } else if (typeof actual === "object") {
    actualTypeStr = actual.constructor?.name ?? "Object";
  } else {
    actualTypeStr = typeof actual;
  }
  if (expectedTypeStr === actualTypeStr) {
    msg = `Expected object to be an instance of "${expectedTypeStr}"${msgSuffix}`;
  } else if (actualTypeStr === "function") {
    msg =
      `Expected object to be an instance of "${expectedTypeStr}" but was not an instanced object${msgSuffix}`;
  } else {
    msg =
      `Expected object to be an instance of "${expectedTypeStr}" but was "${actualTypeStr}"${msgSuffix}`;
  }
  throw new AssertionError(msg);
}
