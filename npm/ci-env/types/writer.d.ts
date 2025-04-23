/**
 * The `writer` module provides a pipeline writer
 * that extends the AnsiWriter to handle
 * logging commands for Github Actions and Azure DevOps.
 *
 * @module
 */
import { type AnsiLogLevel, type AnsiWriter } from "@hyprx/ansi";
import { DefaultAnsiWriter } from "@hyprx/ansi/writer";
import type { SecretMasker } from "@hyprx/secrets";
export declare function handleArguments(args: IArguments): {
  msg: string | undefined;
  stack: string | undefined;
};
/**
 * The contract for the ci pipeline writer
 * which extends the ansi writer to handle logging
 * commands for Github Actions and Azure DevOps.
 */
export interface PipelineWriter extends AnsiWriter {
  /**
   * The secret masker used to mask secrets in the output.
   */
  readonly secretMasker: SecretMasker;
  /**
   * Masks any secrets and writes the string with masked
   * values to the output.
   * @param value The value to update.
   */
  mask(value: string): this;
  /**
   * Masks any secrets and writes the string with masked
   * values to the output as new line.
   * @param value The value to update.
   */
  maskLine(value: string): this;
}
/**
 * The default pipeline writer implementation.
 */
export declare class DefaultPipelineWriter extends DefaultAnsiWriter {
  #private;
  /**
   * Creates a new instance of the default pipeline writer.
   * @param level The log level to use.
   * @param write The write function to use.
   * @param secretMasker The secret masker to use.
   */
  constructor(
    level?: AnsiLogLevel,
    write?: (message?: string) => void,
    secretMasker?: SecretMasker,
  );
  /**
   * The secret masker used to mask secrets in the output.
   */
  get secretMasker(): SecretMasker;
  /**
   * Masks any secrets and writes the string with masked
   * values to the output.
   * @param value The value to update.
   */
  mask(value: string): this;
  /**
   * Masks any secrets and writes the string with masked
   * values to the output as a new line.
   * @param value The value to update.
   */
  maskLine(value: string): this;
  /**
   * Write a command to the output.
   * @param command The name of the command.
   * @param args The arguments passed to the command.
   * @returns The writer instance.
   */
  command(command: string, args?: string[]): this;
  /**
   * Writes the progress of an operation to the output.
   * @param name The name of the progress indicator.
   * @param value The value of the progress indicator.
   * @returns The writer instance.
   */
  progress(name: string, value: number): this;
  /**
   * Start a new group of log messages.
   * @param name The name of the group.
   * @returns The writer instance.
   */
  startGroup(name: string): this;
  /**
   * Ends the current group.
   * @returns The writer instance.
   */
  endGroup(): this;
  /**
   * Write a debug message to the output.
   * @param e The error to write.
   * @param message The message to write.
   * @param args The arguments to format the message.
   * @returns The writer instance.
   */
  debug(e: Error, message?: string | undefined, ...args: unknown[]): this;
  /**
   * Write a debug message to the output.
   * @param message The debug message.
   * @param args The arguments to format the message.
   * @returns The writer instance.
   */
  debug(message: string, ...args: unknown[]): this;
  /**
   * Write an error message to the output.
   * @param e The error to write.
   * @param message The message to write.
   * @param args The arguments to format the message.
   */
  error(e: Error, message?: string | undefined, ...args: unknown[]): this;
  /**
   * Write an error message to the output.
   * @param message The error message.
   * @param args The arguments to format the message.
   * @returns The writer instance.
   */
  error(message: string, ...args: unknown[]): this;
  /**
   * Write a warning message to the output.
   * @param e The error to write.
   * @param message The message to write.
   * @param args The arguments to format the message.
   */
  warn(e: Error, message?: string | undefined, ...args: unknown[]): this;
  /**
   * Write a warning message to the output.
   * @param message The warning message.
   * @param args The arguments to format the message.
   * @returns The writer instance.
   */
  warn(message: string, ...args: unknown[]): this;
}
/**
 * The global writer instance.
 */
export declare const writer: DefaultPipelineWriter;
