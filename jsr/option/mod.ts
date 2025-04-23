/**
 * ## Overview
 *
 * The '@hyprx/option' module provides the `Option<T>` type with functions some, none,
 * and from which are all used to help deal with null and undefined values.
 *
 * ![logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/option)](https://jsr.io/@hyprx/option)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Foption.svg)](https://badge.fury.io/js/@hyprx%2Foption)
 * [![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/option/doc)
 *
 * A list of other modules can be found at [github.com/hyprxland/js-hyprx](https://github.com/hyprxland/js-hyprx)
 *
 * ## Usage
 *
 * ```typescript
 * import { ok, some, none } from "@hyprx/functional";
 *
 * const o1 = none<number>();
 * console.log(o1.isSome); // false
 * console.log(o1.isNone); // true
 * console.log(o1.unwrapOrElse(() => 50)); // 50
 *
 * const o = some(10);
 * console.log(o.isSome); // true
 * console.log(o.isNone); // false
 * o.inspect(g => console.log(g));
 * console.log(o.map(g => g * 60).unwrap()); // 60
 *
 * ```
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 * @module
 */
type State = 0 | 1;

const States = {
    None: 0 as State,
    Some: 1 as State,
};

/**
 * Represents an error that occurs in the Option class.
 */
export class OptionError extends Error {
    /**
     * Creates a new OptionError instance.
     * @param message The error message.
     * @param innerError The inner error.
     */
    constructor(message?: string, options?: ErrorOptions) {
        super(message ?? "Option error", options);
        this.name = "OptionError";
    }
}

/**
 * Represents an optional value that may or may not be present.
 * @template T - The type of the value.
 */
export class Option<T> {
    #state: State;
    #value?: T;

    /**
     * Creates a new Option instance.
     * @param value - The optional value.
     */
    constructor(value?: T) {
        this.#state = value === undefined || value === null ? States.None : States.Some;
        this.#value = value;
    }

    /**
     * Gets the value of the Option.
     * @returns The value.
     * @throws {OptionError} If the Option is None.
     */
    get value(): T {
        return this.unwrap();
    }

    /**
     * Checks if the Option is Some.
     * @returns True if the Option is Some, false otherwise.
     */
    get isSome(): boolean {
        return this.#state === States.Some;
    }

    /**
     * Checks if the Option is None.
     * @returns True if the Option is None, false otherwise.
     */
    get isNone(): boolean {
        return this.#state === States.None;
    }

    /**
     * Returns the other Option if this Option is Some, otherwise returns None.
     * @param other - The other Option.
     * @returns The other Option if this Option is Some, otherwise None.
     */
    and<U>(other: Option<U>): Option<U> {
        return other;
    }

    /**
     * Calls the specified function with the value of this Option if it is Some, otherwise returns None.
     * @param fn - The function to call.
     * @returns The result of the function if this Option is Some, otherwise None.
     */
    andThen<U>(fn: (value: T) => Option<U>): Option<U> {
        if (this.#state === States.None) {
            return new Option<U>();
        }

        return fn(this.#value!);
    }

    /**
     * Returns this Option if it is Some, otherwise returns the other Option.
     * @param other - The other Option.
     * @returns This Option if it is Some, otherwise the other Option.
     */
    or(other: Option<T>): Option<T> {
        if (this.#state === States.Some) {
            return this;
        }

        return other;
    }

    /**
     * Calls the specified function if this Option is None, otherwise returns this Option.
     * @param fn - The function to call.
     * @returns This Option if it is Some, otherwise the result of the function.
     */
    orElse(fn: () => Option<T>): Option<T> {
        if (this.#state === States.Some) {
            return this;
        }

        return fn();
    }

    /**
     * Expects the Option to be Some and returns the value, otherwise throws an OptionError with the specified message.
     * @param message - The error message.
     * @returns The value if the Option is Some.
     * @throws {OptionError} If the Option is None.
     */
    expect(message: string): T {
        if (this.#state === States.None) {
            throw new OptionError(message);
        }
        return this.#value!;
    }

    /**
     * Transforms the Option's value using the specified function if it is Some, otherwise returns None.
     * @param fn - The function to transform the value.
     * @returns The transformed Option if it is Some, otherwise None.
     */
    map<U>(fn: (value: T) => U): Option<U> {
        if (this.#state === States.None) {
            return new Option<U>();
        }

        return new Option<U>(fn(this.#value!));
    }

    /**
     * Matches the state of the option and executes the corresponding function.
     *
     * @template U - The return type when the option is in the Some state.
     * @template V - The return type when the option is in the None state.
     * @param {function(value: T): U} fnSome - The function to execute when the option is in the Some state.
     * @param {function(): V} fnNone - The function to execute when the option is in the None state.
     * @returns {U | V} - The result of executing the corresponding function.
     */
    match<U, V>(fnSome: (value: T) => U, fnNone: () => V): U | V {
        if (this.#state === States.Some) {
            return fnSome(this.#value!);
        }

        return fnNone();
    }

    /**
     * Calls the specified function with the value of this Option if it is Some, otherwise returns this Option.
     * @param fn - The function to call.
     * @returns This Option.
     */
    inspect(fn: (value: T) => void): Option<T> {
        if (this.#state === States.Some) {
            fn(this.#value!);
        }

        return this;
    }

    /**
     * Unwraps the Option and returns the value if it is Some, otherwise throws an OptionError.
     * @returns The value if the Option is Some.
     * @throws {OptionError} If the Option is None.
     */
    unwrap(): T {
        if (this.#state === States.None) {
            throw new OptionError("Option is None");
        }
        return this.#value!;
    }

    /**
     * Unwraps the Option and returns the value if it is Some, otherwise returns the specified default value.
     * @param defaultValue - The default value.
     * @returns The value if the Option is Some, otherwise the default value.
     */
    unwrapOr(defaultValue: T): T {
        if (this.#state === States.None) {
            return defaultValue;
        }

        return this.#value!;
    }

    /**
     * Unwraps the Option and returns the value if it is Some, otherwise calls the specified function and returns its result.
     * @param fn - The function to call.
     * @returns The value if the Option is Some, otherwise the result of the function.
     */
    unwrapOrElse(fn: () => T): T {
        if (this.#state === States.None) {
            return fn();
        }

        return this.#value!;
    }

    /**
     * Checks if the option satisfies the given condition.
     *
     * @param fn - The condition function that takes a value of type T and returns a boolean.
     * @returns `true` if the option satisfies the condition, `false` otherwise.
     */
    if(fn: (value: T) => boolean): boolean {
        if (this.#state === States.None) {
            return false;
        }

        return fn(this.#value!);
    }

    /**
     * Combines this Option with another Option into a single Option containing a tuple of their values.
     * @param other - The other Option.
     * @returns An Option containing a tuple of the values if both Options are Some, otherwise None.
     */
    zip<U>(other: Option<U>): Option<[T, U]> {
        if (this.#state === States.None || other.#state === States.None) {
            return new Option<[T, U]>();
        }

        return new Option<[T, U]>([this.#value!, other.#value!]);
    }
}

/**
 * Creates an Option representing None.
 * @returns An Option representing None.
 */
export function none<T>(): Option<T> {
    return new Option<T>(undefined);
}

/**
 * Creates an Option representing Some.
 * @param value The value.
 * @returns An Option representing Some.
 */
export function some<T>(value: T): Option<T> {
    return new Option<T>(value);
}

/**
 * Creates an Option from a value. If the value is null or undefined, returns None, otherwise returns Some.
 * @param value The value.
 * @returns The Option.
 */
export function from<T>(value: T | null | undefined): Option<T> {
    if (value === null || value === undefined) {
        return none();
    }

    return some(value);
}
