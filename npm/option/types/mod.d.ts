/**
 * Represents an error that occurs in the Option class.
 */
export declare class OptionError extends Error {
  /**
   * Creates a new OptionError instance.
   * @param message The error message.
   * @param innerError The inner error.
   */
  constructor(message?: string, options?: ErrorOptions);
}
/**
 * Represents an optional value that may or may not be present.
 * @template T - The type of the value.
 */
export declare class Option<T> {
  #private;
  /**
   * Creates a new Option instance.
   * @param value - The optional value.
   */
  constructor(value?: T);
  /**
   * Gets the value of the Option.
   * @returns The value.
   * @throws {OptionError} If the Option is None.
   */
  get value(): T;
  /**
   * Checks if the Option is Some.
   * @returns True if the Option is Some, false otherwise.
   */
  get isSome(): boolean;
  /**
   * Checks if the Option is None.
   * @returns True if the Option is None, false otherwise.
   */
  get isNone(): boolean;
  /**
   * Returns the other Option if this Option is Some, otherwise returns None.
   * @param other - The other Option.
   * @returns The other Option if this Option is Some, otherwise None.
   */
  and<U>(other: Option<U>): Option<U>;
  /**
   * Calls the specified function with the value of this Option if it is Some, otherwise returns None.
   * @param fn - The function to call.
   * @returns The result of the function if this Option is Some, otherwise None.
   */
  andThen<U>(fn: (value: T) => Option<U>): Option<U>;
  /**
   * Returns this Option if it is Some, otherwise returns the other Option.
   * @param other - The other Option.
   * @returns This Option if it is Some, otherwise the other Option.
   */
  or(other: Option<T>): Option<T>;
  /**
   * Calls the specified function if this Option is None, otherwise returns this Option.
   * @param fn - The function to call.
   * @returns This Option if it is Some, otherwise the result of the function.
   */
  orElse(fn: () => Option<T>): Option<T>;
  /**
   * Expects the Option to be Some and returns the value, otherwise throws an OptionError with the specified message.
   * @param message - The error message.
   * @returns The value if the Option is Some.
   * @throws {OptionError} If the Option is None.
   */
  expect(message: string): T;
  /**
   * Transforms the Option's value using the specified function if it is Some, otherwise returns None.
   * @param fn - The function to transform the value.
   * @returns The transformed Option if it is Some, otherwise None.
   */
  map<U>(fn: (value: T) => U): Option<U>;
  /**
   * Matches the state of the option and executes the corresponding function.
   *
   * @template U - The return type when the option is in the Some state.
   * @template V - The return type when the option is in the None state.
   * @param {function(value: T): U} fnSome - The function to execute when the option is in the Some state.
   * @param {function(): V} fnNone - The function to execute when the option is in the None state.
   * @returns {U | V} - The result of executing the corresponding function.
   */
  match<U, V>(fnSome: (value: T) => U, fnNone: () => V): U | V;
  /**
   * Calls the specified function with the value of this Option if it is Some, otherwise returns this Option.
   * @param fn - The function to call.
   * @returns This Option.
   */
  inspect(fn: (value: T) => void): Option<T>;
  /**
   * Unwraps the Option and returns the value if it is Some, otherwise throws an OptionError.
   * @returns The value if the Option is Some.
   * @throws {OptionError} If the Option is None.
   */
  unwrap(): T;
  /**
   * Unwraps the Option and returns the value if it is Some, otherwise returns the specified default value.
   * @param defaultValue - The default value.
   * @returns The value if the Option is Some, otherwise the default value.
   */
  unwrapOr(defaultValue: T): T;
  /**
   * Unwraps the Option and returns the value if it is Some, otherwise calls the specified function and returns its result.
   * @param fn - The function to call.
   * @returns The value if the Option is Some, otherwise the result of the function.
   */
  unwrapOrElse(fn: () => T): T;
  /**
   * Checks if the option satisfies the given condition.
   *
   * @param fn - The condition function that takes a value of type T and returns a boolean.
   * @returns `true` if the option satisfies the condition, `false` otherwise.
   */
  if(fn: (value: T) => boolean): boolean;
  /**
   * Combines this Option with another Option into a single Option containing a tuple of their values.
   * @param other - The other Option.
   * @returns An Option containing a tuple of the values if both Options are Some, otherwise None.
   */
  zip<U>(other: Option<U>): Option<[T, U]>;
}
/**
 * Creates an Option representing None.
 * @returns An Option representing None.
 */
export declare function none<T>(): Option<T>;
/**
 * Creates an Option representing Some.
 * @param value The value.
 * @returns An Option representing Some.
 */
export declare function some<T>(value: T): Option<T>;
/**
 * Creates an Option from a value. If the value is null or undefined, returns None, otherwise returns Some.
 * @param value The value.
 * @returns The Option.
 */
export declare function from<T>(value: T | null | undefined): Option<T>;
