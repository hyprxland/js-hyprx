// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.ts";
import { isError } from "./is-error.ts";

/**
 * Executes a function which returns a promise, expecting it to reject.
 *
 * To assert that a synchronous function throws, use {@linkcode assertThrows}.
 *
 * @example Usage
 * ```ts ignore
 * import { rejects } from "@hyprxassert";
 *
 * await rejects(async () => Promise.reject(new Error())); // Doesn't throw
 * await rejects(async () => console.log("Hello world")); // Throws
 * ```
 *
 * @param fn The function to execute.
 * @param msg The optional message to display if the assertion fails.
 * @returns The promise which resolves to the thrown error.
 */
export function rejects(
    fn: () => PromiseLike<unknown>,
    msg?: string,
): Promise<unknown>;
/**
 * Executes a function which returns a promise, expecting it to reject.
 * If it does not, then it throws. An error class and a string that should be
 * included in the error message can also be asserted.
 *
 * To assert that a synchronous function throws, use {@linkcode assertThrows}.
 *
 * @example Usage
 * ```ts ignore
 * import { rejects } from "@hyprxassert";
 *
 * await rejects(async () => Promise.reject(new Error()), Error); // Doesn't throw
 * await rejects(async () => Promise.reject(new Error()), SyntaxError); // Throws
 * ```
 *
 * @typeParam E The error class to assert.
 * @param fn The function to execute.
 * @param ErrorClass The error class to assert.
 * @param msgIncludes The string that should be included in the error message.
 * @param msg The optional message to display if the assertion fails.
 * @returns The promise which resolves to the thrown error.
 */
export function rejects<E extends Error = Error>(
    fn: () => PromiseLike<unknown>,
    // deno-lint-ignore no-explicit-any
    ErrorClass: abstract new (...args: any[]) => E,
    msgIncludes?: string,
    msg?: string,
): Promise<E>;
export async function rejects<E extends Error = Error>(
    fn: () => PromiseLike<unknown>,
    errorClassOrMsg?:
        // deno-lint-ignore no-explicit-any
        | (abstract new (...args: any[]) => E)
        | string,
    msgIncludesOrMsg?: string,
    msg?: string,
): Promise<E | Error | unknown> {
    // deno-lint-ignore no-explicit-any
    let ErrorClass: (abstract new (...args: any[]) => E) | undefined;
    let msgIncludes: string | undefined;
    let err;

    if (typeof errorClassOrMsg !== "string") {
        if (
            errorClassOrMsg === undefined ||
            errorClassOrMsg.prototype instanceof Error ||
            errorClassOrMsg.prototype === Error.prototype
        ) {
            ErrorClass = errorClassOrMsg;
            msgIncludes = msgIncludesOrMsg;
        }
    } else {
        msg = errorClassOrMsg;
    }
    let doesThrow = false;
    let isPromiseReturned = false;
    const msgSuffix = msg ? `: ${msg}` : ".";
    try {
        const possiblePromise = fn();
        if (
            possiblePromise &&
            typeof possiblePromise === "object" &&
            typeof possiblePromise.then === "function"
        ) {
            isPromiseReturned = true;
            await possiblePromise;
        } else {
            throw new Error();
        }
    } catch (error) {
        if (!isPromiseReturned) {
            throw new AssertionError(
                `Function throws when expected to reject${msgSuffix}`,
            );
        }
        if (ErrorClass) {
            if (!(error instanceof Error)) {
                throw new AssertionError(`A non-Error object was rejected${msgSuffix}`);
            }
            isError(
                error,
                ErrorClass,
                msgIncludes,
                msg,
            );
        }
        err = error;
        doesThrow = true;
    }
    if (!doesThrow) {
        throw new AssertionError(
            `Expected function to reject${msgSuffix}`,
        );
    }
    return err;
}
