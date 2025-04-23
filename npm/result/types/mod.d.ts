/**
 * ## Overview
 *
 * The '@hyprx/result' module provides the `Result<T,E>` type with functions ok, fail,
 * tryCatch, and tryCatchSync which are all used to help deal with returning results
 * or errors.
 *
 * ![logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/result)](https://jsr.io/@hyprx/result)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Fresult.svg)](https://badge.fury.io/js/@hyprx%2Fresult)
 * [![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/result/doc)
 *
 * A list of other modules can be found at [github.com/hyprxland/js-hyprx](https://github.com/hyprxland/js-hyprx)
 *
 * ## Usage
 *
 * ```typescript
 * import { ok, fail, tryCatchSync } from "@hyprx/functional";
 *
 * const r = ok(10);
 * console.log(r.isOk);
 * console.log(r.isError);
 *
 * console.log(r.map((v) => v.toString()));
 *
 * const r1 = tryCatchSync<number>(() => {
 *     throw Error("test");
 * });
 *
 * console.log(r1.isError); // true
 *
 * const r2 = fail<number>(new Error("test"));
 * console.log(r2.isError); // true;
 *
 * ```
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 * @module
 */
import { Option } from "@hyprx/option";
/**
 * Represents an error that occurred while processing a result.
 */
export declare class ResultError extends Error {
  /**
   * Creates a new instance of ResultError.
   * @param message - The error message.
   * @param innerError - The inner error, if any.
   */
  constructor(message?: string, options?: ErrorOptions);
}
/**
 * Represents a result that can either be a value of type `T` or an error of type `E`.
 * @typeparam T - The type of the value.
 * @typeparam E - The type of the error.
 */
export declare class Result<T, E = Error> {
  #private;
  /**
   * Creates a new instance of Result.
   * @param value - The value of type `T`, if any.
   * @param error - The error of type `E`, if any.
   * @throws ResultError if both value and error are provided.
   */
  constructor(value?: T, error?: E);
  /**
   * Gets a value indicating whether the result is Ok.
   */
  get isOk(): boolean;
  /**
   * Gets a value indicating whether the result is an error.
   */
  get isError(): boolean;
  /**
   * Returns the value as an Option.
   * @returns An Option containing the value if the result is Ok, otherwise an empty Option.
   */
  ok(): Option<T>;
  /**
   * Returns the error as an Option.
   * @returns An Option containing the error if the result is an error, otherwise an empty Option.
   */
  error(): Option<E>;
  /**
   * Returns the result of `other` if the result is Ok, otherwise returns the current error.
   * @typeparam U - The type of the value in the other result.
   * @param other - The other result.
   * @returns The other result if the current result is Ok, otherwise a new result with the current error.
   */
  and<U>(other: Result<U, E>): Result<U, E>;
  /**
   * Calls the provided function with the value if the result is Ok, otherwise returns a new result with the current error.
   * @typeparam U - The type of the value returned by the function.
   * @param fn - The function to call with the value.
   * @returns The result of the function if the current result is Ok, otherwise a new result with the current error.
   */
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  /**
   * Returns the current result if it is Ok, otherwise returns the other result.
   * @param other - The other result.
   * @returns The current result if it is Ok, otherwise the other result.
   */
  or(other: Result<T, E>): Result<T, E>;
  /**
   * Calls the provided function with the error if the result is an error, otherwise returns the current result.
   * @param fn - The function to call with the error.
   * @returns The current result if it is Ok, otherwise the result of the function.
   */
  orElse(fn: (error: E) => Result<T, E>): Result<T, E>;
  /**
   * Checks if the condition specified by the provided function is true.
   *
   * @param fn - The function that specifies the condition to check.
   * @returns `true` if the condition is true, `false` otherwise.
   */
  if(fn: (value: T) => boolean): boolean;
  /**
   * Tests the error with the provided function.
   * @param fn The function to call with the error.
   * @returns `true` if the condition is true, `false` otherwise.
   */
  testError(fn: (error: E) => boolean): boolean;
  /**
   * Returns the value of the result as an array.
   * If the result is in the Ok state, the value is wrapped in an array and returned.
   * If the result is in any other state, an empty array is returned.
   *
   * @returns An array containing the value of the result, or an empty array.
   */
  asArray(): T[];
  /**
   * Resolves the promise with the stored value if the state is `Ok`,
   * otherwise rejects the promise with the stored error.
   *
   * @returns A promise that resolves with the stored value or rejects with the stored error.
   */
  resolve(): Promise<T>;
  /**
   * Unwraps the value if the result is Ok, otherwise throws a ResultError with the error message.
   * @returns The unwrapped value.
   * @throws ResultError if the result is an error.
   */
  unwrap(): T;
  /**
   * Unwraps the value if the result is Ok, otherwise returns the provided default value.
   * @param defaultValue - The default value to return if the result is an error.
   * @returns The unwrapped value if the result is Ok, otherwise the default value.
   */
  unwrapOr(defaultValue: T): T;
  /**
   * Unwraps the value if the result is Ok, otherwise calls the provided function and returns its result.
   * @param fn - The function to call if the result is an error.
   * @returns The unwrapped value if the result is Ok, otherwise the result of the function.
   */
  unwrapOrElse(fn: () => T): T;
  /**
   * Unwraps the error if the result is an error, otherwise throws an Error with the message "Result is Ok".
   * @returns The unwrapped error.
   * @throws Error if the result is Ok.
   */
  unwrapError(): E;
  /**
   * Calls the provided function with the value if the result is Ok.
   * @param fn - The function to call with the value.
   * @returns The current result.
   */
  inspect(fn: (value: T) => void): Result<T, E>;
  /**
   * Expects the result to be Ok, otherwise throws an Error with the provided message.
   * @param message - The error message to throw.
   * @returns The unwrapped value.
   * @throws Error if the result is an error.
   */
  expect(message: string): T;
  /**
   * Expects the result to be an error, otherwise throws an Error with the provided message.
   * @param message - The error message to throw.
   * @returns The unwrapped error.
   * @throws Error if the result is Ok.
   */
  expectError(message: string): E;
  /**
   * Maps the value of the result to a new value using the provided function if the result is Ok, otherwise returns a new result with the current error.
   * @typeparam U - The type of the new value.
   * @param fn - The function to map the value.
   * @returns A new result with the mapped value if the current result is Ok, otherwise a new result with the current error.
   */
  map<U>(fn: (value: T) => U): Result<U, E>;
  /**
   * Maps the value of the result to a new value using the provided function if the result is Ok, otherwise returns the provided default value.
   * @typeparam U - The type of the new value.
   * @param defaultValue - The default value to return if the result is an error.
   * @param fn - The function to map the value.
   * @returns The mapped value if the result is Ok, otherwise the default value.
   */
  mapOr<U>(defaultValue: U, fn: (value: T) => U): U;
  /**
   * Maps the value of the result to a new value using the provided function if the result is Ok, otherwise calls the provided default function and returns its result.
   * @typeparam U - The type of the new value.
   * @param defaultFn - The default function to call if the result is an error.
   * @param fn - The function to map the value.
   * @returns The mapped value if the result is Ok, otherwise the result of the default function.
   */
  mapOrElse<U>(defaultFn: () => U, fn: (value: T) => U): U;
  /**
   * Maps the error of the result to a new error using the provided function if the result is an error, otherwise returns a new result with the current value.
   * @typeparam F - The type of the new error.
   * @param fn - The function to map the error.
   * @returns A new result with the current value if the current result is Ok, otherwise a new result with the mapped error.
   */
  mapError<F>(fn: (error: E) => F): Result<T, F>;
  /**
   * Maps the error of the result to a new error using the provided function if the result is an error, otherwise returns the provided default error.
   * @typeparam F - The type of the new error.
   * @param defaultError - The default error to return if the result is Ok.
   * @param fn - The function to map the error.
   * @returns The mapped error if the result is an error, otherwise the default error.
   */
  mapErrorOr<F>(defaultError: F, fn: (error: E) => F): F;
  /**
   * Maps the error of the result to a new error using the provided function if the result is an error, otherwise calls the provided default function and returns its result.
   * @typeparam F - The type of the new error.
   * @param defaultFn - The default function to call if the result is Ok.
   * @param fn - The function to map the error.
   * @returns The mapped error if the result is an error, otherwise the result of the default function.
   */
  mapErrorOrElse<F>(defaultFn: () => F, fn: (error: E) => F): F;
}
/**
 * Represents a successful result with a value of type `T`.
 * @typeparam T - The type of the value.
 */
export declare class Ok<T> extends Result<T, never> {
  /**
   * Creates a new instance of Ok.
   * @param value - The value of type `T`.
   */
  constructor(value: T);
}
/**
 * Represents an error result with an error of type `E`.
 * @typeparam E - The type of the error.
 */
export declare class Err<E = Error> extends Result<never, E> {
  /**
   * Creates a new instance of Err.
   * @param error - The error of type `E`.
   */
  constructor(error: E);
}
/**
 * Creates a new Ok result with the provided value.
 * @typeparam T - The type of the value.
 * @typeparam E - The type of the error.
 * @param value - The value of type `T`.
 * @returns A new Ok result.
 */
export declare function ok<T, E>(value: T): Result<T, E>;
/**
 * Creates a new Err result with the provided error.
 * @typeparam T - The type of the value.
 * @typeparam E - The type of the error.
 * @param error - The error of type `E`.
 * @returns A new Err result.
 */
export declare function fail<T = never, E = Error>(error: E): Result<T, E>;
/**
 * Creates a result of Result<T> as an Err result and coerces the provided error
 * to an Error, if the failure value is not already an Error.
 * @returns A new Err result with a value of error.
 */
export declare function failAsError<T = unknown>(error: unknown): Result<T>;
/**
 * Creates a `Result<void>` a new Ok result with a value of `void`.
 * @returns A new Ok result with a value of `void`.
 */
export declare function voided(): Result<void>;
/**
 * Syncronously try to execute the provided function and return a result.
 * @param fn The function to execute
 * @returns The result of the function.
 */
export declare function tryCatchSync<T>(fn: () => T): Result<T, Error>;
/**
 * Try to execute the provided function and return a result.
 * @param fn The function to execute
 * @returns The result of the function.
 */
export declare function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;
