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
const States = {
  Ok: 0,
  Err: 1,
};
/**
 * Represents an error that occurred while processing a result.
 */
export class ResultError extends Error {
  /**
   * Creates a new instance of ResultError.
   * @param message - The error message.
   * @param innerError - The inner error, if any.
   */
  constructor(message, options) {
    super(message ?? "Result error.", options);
    this.name = "ResultError";
  }
}
/**
 * Represents a result that can either be a value of type `T` or an error of type `E`.
 * @typeparam T - The type of the value.
 * @typeparam E - The type of the error.
 */
export class Result {
  #state;
  #value;
  #error;
  /**
   * Creates a new instance of Result.
   * @param value - The value of type `T`, if any.
   * @param error - The error of type `E`, if any.
   * @throws ResultError if both value and error are provided.
   */
  constructor(value, error) {
    if (value !== undefined && error !== undefined) {
      throw new ResultError("Result cannot have both value and error");
    }
    this.#state = value !== undefined && value !== null ? States.Ok : States.Err;
    this.#value = value;
    this.#error = error;
  }
  /**
   * Gets a value indicating whether the result is Ok.
   */
  get isOk() {
    return this.#state === States.Ok;
  }
  /**
   * Gets a value indicating whether the result is an error.
   */
  get isError() {
    return this.#state === States.Err;
  }
  /**
   * Returns the value as an Option.
   * @returns An Option containing the value if the result is Ok, otherwise an empty Option.
   */
  ok() {
    if (this.#state === States.Ok) {
      return new Option(this.#value);
    }
    return new Option();
  }
  /**
   * Returns the error as an Option.
   * @returns An Option containing the error if the result is an error, otherwise an empty Option.
   */
  error() {
    if (this.#state === States.Err) {
      return new Option(this.#error);
    }
    return new Option();
  }
  /**
   * Returns the result of `other` if the result is Ok, otherwise returns the current error.
   * @typeparam U - The type of the value in the other result.
   * @param other - The other result.
   * @returns The other result if the current result is Ok, otherwise a new result with the current error.
   */
  and(other) {
    if (this.#state === States.Ok) {
      return other;
    }
    return new Result(undefined, this.#error);
  }
  /**
   * Calls the provided function with the value if the result is Ok, otherwise returns a new result with the current error.
   * @typeparam U - The type of the value returned by the function.
   * @param fn - The function to call with the value.
   * @returns The result of the function if the current result is Ok, otherwise a new result with the current error.
   */
  andThen(fn) {
    if (this.#state === States.Err) {
      return new Result(undefined, this.#error);
    }
    return fn(this.#value);
  }
  /**
   * Returns the current result if it is Ok, otherwise returns the other result.
   * @param other - The other result.
   * @returns The current result if it is Ok, otherwise the other result.
   */
  or(other) {
    if (this.#state === States.Ok) {
      return this;
    }
    return other;
  }
  /**
   * Calls the provided function with the error if the result is an error, otherwise returns the current result.
   * @param fn - The function to call with the error.
   * @returns The current result if it is Ok, otherwise the result of the function.
   */
  orElse(fn) {
    if (this.#state === States.Ok) {
      return this;
    }
    return fn(this.#error);
  }
  /**
   * Checks if the condition specified by the provided function is true.
   *
   * @param fn - The function that specifies the condition to check.
   * @returns `true` if the condition is true, `false` otherwise.
   */
  if(fn) {
    if (this.#state === States.Ok) {
      return fn(this.#value);
    }
    return false;
  }
  /**
   * Tests the error with the provided function.
   * @param fn The function to call with the error.
   * @returns `true` if the condition is true, `false` otherwise.
   */
  testError(fn) {
    if (this.#state === States.Err) {
      return fn(this.#error);
    }
    return false;
  }
  /**
   * Returns the value of the result as an array.
   * If the result is in the Ok state, the value is wrapped in an array and returned.
   * If the result is in any other state, an empty array is returned.
   *
   * @returns An array containing the value of the result, or an empty array.
   */
  asArray() {
    if (this.#state === States.Ok) {
      return [this.#value];
    }
    return [];
  }
  /**
   * Resolves the promise with the stored value if the state is `Ok`,
   * otherwise rejects the promise with the stored error.
   *
   * @returns A promise that resolves with the stored value or rejects with the stored error.
   */
  resolve() {
    return this.#state === States.Ok ? Promise.resolve(this.#value) : Promise.reject(this.#error);
  }
  /**
   * Unwraps the value if the result is Ok, otherwise throws a ResultError with the error message.
   * @returns The unwrapped value.
   * @throws ResultError if the result is an error.
   */
  unwrap() {
    if (this.#state === States.Err) {
      if (this.#error instanceof Error) {
        throw new ResultError(`Result is error ${this.#error.message}`, this.#error);
      }
      throw new ResultError(`Result is error ${this.#error}`);
    }
    return this.#value;
  }
  /**
   * Unwraps the value if the result is Ok, otherwise returns the provided default value.
   * @param defaultValue - The default value to return if the result is an error.
   * @returns The unwrapped value if the result is Ok, otherwise the default value.
   */
  unwrapOr(defaultValue) {
    if (this.#state === States.Ok) {
      return this.#value;
    }
    return defaultValue;
  }
  /**
   * Unwraps the value if the result is Ok, otherwise calls the provided function and returns its result.
   * @param fn - The function to call if the result is an error.
   * @returns The unwrapped value if the result is Ok, otherwise the result of the function.
   */
  unwrapOrElse(fn) {
    if (this.#state === States.Ok) {
      return this.#value;
    }
    return fn();
  }
  /**
   * Unwraps the error if the result is an error, otherwise throws an Error with the message "Result is Ok".
   * @returns The unwrapped error.
   * @throws Error if the result is Ok.
   */
  unwrapError() {
    if (this.#state === States.Ok) {
      throw new ResultError("Result is Ok");
    }
    return this.#error;
  }
  /**
   * Calls the provided function with the value if the result is Ok.
   * @param fn - The function to call with the value.
   * @returns The current result.
   */
  inspect(fn) {
    if (this.#state === States.Ok) {
      fn(this.#value);
    }
    return this;
  }
  /**
   * Expects the result to be Ok, otherwise throws an Error with the provided message.
   * @param message - The error message to throw.
   * @returns The unwrapped value.
   * @throws Error if the result is an error.
   */
  expect(message) {
    if (this.#state === States.Err) {
      throw new ResultError(message);
    }
    return this.#value;
  }
  /**
   * Expects the result to be an error, otherwise throws an Error with the provided message.
   * @param message - The error message to throw.
   * @returns The unwrapped error.
   * @throws Error if the result is Ok.
   */
  expectError(message) {
    if (this.#state === States.Ok) {
      throw new ResultError(message);
    }
    return this.#error;
  }
  /**
   * Maps the value of the result to a new value using the provided function if the result is Ok, otherwise returns a new result with the current error.
   * @typeparam U - The type of the new value.
   * @param fn - The function to map the value.
   * @returns A new result with the mapped value if the current result is Ok, otherwise a new result with the current error.
   */
  map(fn) {
    if (this.#state === States.Err) {
      return new Result(undefined, this.#error);
    }
    return new Result(fn(this.#value));
  }
  /**
   * Maps the value of the result to a new value using the provided function if the result is Ok, otherwise returns the provided default value.
   * @typeparam U - The type of the new value.
   * @param defaultValue - The default value to return if the result is an error.
   * @param fn - The function to map the value.
   * @returns The mapped value if the result is Ok, otherwise the default value.
   */
  mapOr(defaultValue, fn) {
    if (this.#state === States.Err) {
      return defaultValue;
    }
    return fn(this.#value);
  }
  /**
   * Maps the value of the result to a new value using the provided function if the result is Ok, otherwise calls the provided default function and returns its result.
   * @typeparam U - The type of the new value.
   * @param defaultFn - The default function to call if the result is an error.
   * @param fn - The function to map the value.
   * @returns The mapped value if the result is Ok, otherwise the result of the default function.
   */
  mapOrElse(defaultFn, fn) {
    if (this.#state === States.Err) {
      return defaultFn();
    }
    return fn(this.#value);
  }
  /**
   * Maps the error of the result to a new error using the provided function if the result is an error, otherwise returns a new result with the current value.
   * @typeparam F - The type of the new error.
   * @param fn - The function to map the error.
   * @returns A new result with the current value if the current result is Ok, otherwise a new result with the mapped error.
   */
  mapError(fn) {
    if (this.#state === States.Ok) {
      return new Result(this.#value);
    }
    return new Result(undefined, fn(this.#error));
  }
  /**
   * Maps the error of the result to a new error using the provided function if the result is an error, otherwise returns the provided default error.
   * @typeparam F - The type of the new error.
   * @param defaultError - The default error to return if the result is Ok.
   * @param fn - The function to map the error.
   * @returns The mapped error if the result is an error, otherwise the default error.
   */
  mapErrorOr(defaultError, fn) {
    if (this.#state === States.Ok) {
      return defaultError;
    }
    return fn(this.#error);
  }
  /**
   * Maps the error of the result to a new error using the provided function if the result is an error, otherwise calls the provided default function and returns its result.
   * @typeparam F - The type of the new error.
   * @param defaultFn - The default function to call if the result is Ok.
   * @param fn - The function to map the error.
   * @returns The mapped error if the result is an error, otherwise the result of the default function.
   */
  mapErrorOrElse(defaultFn, fn) {
    if (this.#state === States.Ok) {
      return defaultFn();
    }
    return fn(this.#error);
  }
}
/**
 * Represents a successful result with a value of type `T`.
 * @typeparam T - The type of the value.
 */
export class Ok extends Result {
  /**
   * Creates a new instance of Ok.
   * @param value - The value of type `T`.
   */
  constructor(value) {
    super(value);
  }
}
/**
 * Represents an error result with an error of type `E`.
 * @typeparam E - The type of the error.
 */
export class Err extends Result {
  /**
   * Creates a new instance of Err.
   * @param error - The error of type `E`.
   */
  constructor(error) {
    super(undefined, error);
  }
}
/**
 * Creates a new Ok result with the provided value.
 * @typeparam T - The type of the value.
 * @typeparam E - The type of the error.
 * @param value - The value of type `T`.
 * @returns A new Ok result.
 */
export function ok(value) {
  return new Ok(value);
}
/**
 * Creates a new Err result with the provided error.
 * @typeparam T - The type of the value.
 * @typeparam E - The type of the error.
 * @param error - The error of type `E`.
 * @returns A new Err result.
 */
export function fail(error) {
  return new Err(error);
}
/**
 * Creates a result of Result<T> as an Err result and coerces the provided error
 * to an Error, if the failure value is not already an Error.
 * @returns A new Err result with a value of error.
 */
export function failAsError(error) {
  if (error instanceof Error) {
    return fail(error);
  }
  if (typeof error === "string") {
    return fail(new Error(error));
  }
  return fail(new Error(`Unexpected error: ${error}`));
}
/**
 * Creates a `Result<void>` a new Ok result with a value of `void`.
 * @returns A new Ok result with a value of `void`.
 */
export function voided() {
  return new Ok(void 0);
}
/**
 * Syncronously try to execute the provided function and return a result.
 * @param fn The function to execute
 * @returns The result of the function.
 */
export function tryCatchSync(fn) {
  try {
    return ok(fn());
  } catch (error) {
    if (error instanceof Error) {
      return fail(error);
    }
    return fail(new Error(`${error}`));
  }
}
/**
 * Try to execute the provided function and return a result.
 * @param fn The function to execute
 * @returns The result of the function.
 */
export async function tryCatch(fn) {
  try {
    const value = await fn();
    return ok(value);
  } catch (error) {
    if (error instanceof Error) {
      return fail(error);
    }
    return fail(new Error(`${error}`));
  }
}
