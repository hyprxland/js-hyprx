/**
 * The `writer` module provides a simple and flexible way to write messages to the console with ANSI styles.
 * It allows you to write messages with different log levels, such as `info`, `debug`, `warn`, and `error`,
 * styled messages, log commands, and more.
 *
 * @module
 */
import { AnsiSettings } from "./settings.js";
import { type AnsiLogLevel } from "./enums.js";
export declare function handleArguments(args: IArguments): {
  msg: string | undefined;
  stack: string | undefined;
};
export interface AnsiWriter {
  /**
   * Determines if the writer is interactive.
   */
  readonly interactive: boolean;
  /**
   * Gets the ANSI settings.
   */
  readonly settings: AnsiSettings;
  /**
   * Gets or sets the log level.
   */
  level: AnsiLogLevel;
  /**
   * Determines if the log level is enabled.
   * @param level The log level.
   */
  enabled(level: AnsiLogLevel): boolean;
  /**
   * Starts a new group that groups a set of messages.
   * @param name The group name.
   * @returns The writer.
   */
  startGroup(name: string): this;
  /**
   * Ends the current group.
   * @returns The writer.
   */
  endGroup(): this;
  /**
   * Writes a success message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  success(message: string, ...args: unknown[]): this;
  /**
   * Writes the progress of an operation to the output.
   * @param name The name of the progress.
   * @param value The value of the progress.
   * @returns The writer.
   */
  progress(name: string, value: number): this;
  /**
   * Writes a command to the output.
   * @param message The executable.
   * @param args The arguments passed to the command.
   * @returns The writer.
   */
  command(command: string, args?: string[]): this;
  /**
   * Writes an error message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  debug(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes a debug message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  debug(message: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  trace(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes a trace message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  trace(message: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  info(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes an information message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  info(message: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  error(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  error(message: string, ...args: unknown[]): this;
  /**
   * Writes an warning message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  warn(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes an warning message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  warn(message: string, ...args: unknown[]): this;
  /**
   * Writes a styled message to the output.
   * @param message The message to style.
   * @param styles The styles to apply.
   * @example
   * ```typescript
   * import { writer, bold, green, bgBlue } from "@hyprx/ansi";
   *
   * writer.style("Hello, World!", bold, green, bgBlue);
   * ```
   */
  style(message: string, ...styles: ((str: string) => string)[]): void;
  /**
   * Writes a styled message as a new line to the output.
   * @param message The message to style.
   * @param styles The styles to apply.
   * @example
   * ```typescript
   * import { writer, bold, green, bgBlue } from "@hyprx/ansi";
   *
   * writer.style("Hello, World!", bold, green, bgBlue);
   * ```
   */
  styleLine(message: string, ...styles: ((str: string) => string)[]): void;
  /**
   * Writes a message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  write(message?: string, ...args: unknown[]): this;
  /**
   * Writes a message as new line to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  writeLine(message?: string, ...args: unknown[]): this;
}
/**
 * The default implementation of the ANSI writer.
 */
export declare class DefaultAnsiWriter implements AnsiWriter {
  #private;
  /**
   * Creates a new instance of DefaultAnsiWriter.
   * @param level The log level.
   * @param secretMasker The secret masker.
   */
  constructor(level?: AnsiLogLevel, write?: (message?: string) => void);
  /**
   * Gets or sets the log level.
   */
  get level(): AnsiLogLevel;
  set level(value: AnsiLogLevel);
  /**
   * Determines if the log level is enabled.
   * @param level The log level.
   * @returns `true` if the log level is enabled, `false` otherwise.
   */
  enabled(level: AnsiLogLevel): boolean;
  /**
   * Determines if the current environment is interactive.
   */
  get interactive(): boolean;
  /**
   * Gets the ANSI settings.
   */
  get settings(): AnsiSettings;
  progress(name: string, value: number): this;
  /**
   * Writes a command to the output.
   * @param command The executable.
   * @param args The arguments passed to the command.
   * @returns The writer.
   */
  command(command: string, args?: string[]): this;
  /**
   * Writes an trace message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  trace(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes a trace message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  trace(message: string, ...args: unknown[]): this;
  /**
   * Writes an debug message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  debug(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes a debug message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  debug(message: string, ...args: unknown[]): this;
  /**
   * Writes an warning message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  warn(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes a warning message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  warn(message: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  error(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  error(message: string, ...args: unknown[]): this;
  /**
   * Writes a success message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  success(message: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param e The error.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  info(e: Error, message?: string, ...args: unknown[]): this;
  /**
   * Writes an error message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  info(message: string, ...args: unknown[]): this;
  /**
   * Writes a styled message to the output.
   *
   * @param message The message to style.
   * @param styles The styles to apply.
   * @example
   * ```typescript
   * import { writer, bold, green, bgBlue } from "@hyprx/ansi";
   *
   * writer.style("Hello, World!", bold, green, bgBlue);
   * ```
   */
  style(message: string, ...styles: ((str: string) => string)[]): void;
  /**
   * Writes a styled message as a new line to the output.
   * @param message The message to style.
   * @param styles The styles to apply.
   */
  styleLine(message: string, ...styles: ((str: string) => string)[]): void;
  /**
   * Writes a message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  write(message?: string, ...args: unknown[]): this;
  /**
   * Writes a message as a new line to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  writeLine(message?: string, ...args: unknown[]): this;
  /**
   * Starts a new group that groups a set of messages.
   * @param name The group name.
   * @returns the writer.
   */
  startGroup(name: string): this;
  /**
   * Ends the current group.
   * @returns the writer.
   */
  endGroup(): this;
}
export declare const writer: AnsiWriter;
