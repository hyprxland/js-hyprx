/**
 * The `writer` module provides a pipeline writer
 * that extends the AnsiWriter to handle
 * logging commands for Github Actions and Azure DevOps.
 *
 * @module
 */
import { AnsiLogLevels, red } from "@hyprx/ansi";
import { DefaultAnsiWriter } from "@hyprx/ansi/writer";
import { CI_DRIVER } from "./driver.js";
import { sprintf } from "@hyprx/fmt/printf";
import { getSecretMasker } from "./vars.js";
function handleStack(stack) {
  stack = stack ?? "";
  const index = stack.indexOf("\n");
  if (index === -1) {
    return stack;
  }
  return stack.substring(index + 1);
}
export function handleArguments(args) {
  let msg = undefined;
  let stack = undefined;
  switch (args.length) {
    case 0:
      return { msg, stack };
    case 1: {
      if (args[0] instanceof Error) {
        const e = args[0];
        msg = e.message;
        stack = handleStack(e.stack);
      } else {
        msg = args[0];
      }
      return { msg, stack };
    }
    case 2: {
      if (args[0] instanceof Error) {
        const e = args[0];
        const message = args[1];
        msg = message;
        stack = handleStack(e.stack);
      } else {
        const message = args[0];
        const splat = Array.from(args).slice(1);
        msg = sprintf(message, ...splat);
      }
      return { msg, stack };
    }
    default: {
      if (args[0] instanceof Error) {
        const e = args[0];
        const message = args[1];
        const splat = Array.from(args).slice(2);
        msg = sprintf(message, ...splat);
        stack = handleStack(e.stack);
      } else {
        const message = args[0];
        const splat = Array.from(args).slice(1);
        msg = sprintf(message, ...splat);
      }
      return { msg, stack };
    }
  }
}
/**
 * The default pipeline writer implementation.
 */
export class DefaultPipelineWriter extends DefaultAnsiWriter {
  #secretMasker;
  /**
   * Creates a new instance of the default pipeline writer.
   * @param level The log level to use.
   * @param write The write function to use.
   * @param secretMasker The secret masker to use.
   */
  constructor(level, write, secretMasker) {
    super(level ?? AnsiLogLevels.Information, write);
    this.#secretMasker = secretMasker ?? getSecretMasker();
  }
  /**
   * The secret masker used to mask secrets in the output.
   */
  get secretMasker() {
    return this.#secretMasker;
  }
  /**
   * Masks any secrets and writes the string with masked
   * values to the output.
   * @param value The value to update.
   */
  mask(value) {
    return this.write(this.#secretMasker.mask(value) ?? "");
  }
  /**
   * Masks any secrets and writes the string with masked
   * values to the output as a new line.
   * @param value The value to update.
   */
  maskLine(value) {
    return this.writeLine(this.#secretMasker.mask(value) ?? "");
  }
  /**
   * Write a command to the output.
   * @param command The name of the command.
   * @param args The arguments passed to the command.
   * @returns The writer instance.
   */
  command(command, args) {
    args = args ?? [];
    switch (CI_DRIVER) {
      case "azdo":
        this.writeLine(`##[command]${command} ${args.join(" ")}`);
        return this;
      default: {
        return super.command(command, args);
      }
    }
  }
  /**
   * Writes the progress of an operation to the output.
   * @param name The name of the progress indicator.
   * @param value The value of the progress indicator.
   * @returns The writer instance.
   */
  progress(name, value) {
    switch (CI_DRIVER) {
      case "azdo":
        this.writeLine(`##vso[task.setprogress value=${value};]${name}`);
        return this;
      default:
        return super.progress(name, value);
    }
  }
  /**
   * Start a new group of log messages.
   * @param name The name of the group.
   * @returns The writer instance.
   */
  startGroup(name) {
    switch (CI_DRIVER) {
      case "azdo":
        this.writeLine(`##[group]${name}`);
        return this;
      case "github":
        this.writeLine(`::group::${name}`);
        return this;
      default:
        return super.startGroup(name);
    }
  }
  /**
   * Ends the current group.
   * @returns The writer instance.
   */
  endGroup() {
    switch (CI_DRIVER) {
      case "azdo":
        this.writeLine("##[endgroup]");
        return this;
      case "github":
        this.writeLine("::endgroup::");
        return this;
      default:
        return super.endGroup();
    }
  }
  debug() {
    if (this.level < AnsiLogLevels.Debug) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    switch (CI_DRIVER) {
      case "azdo":
        this.writeLine(`##[debug]${msg}`);
        if (stack) {
          this.writeLine(stack);
        }
        return this;
      case "github":
        this.writeLine(`::debug::${msg}`);
        if (stack) {
          this.writeLine(stack);
        }
        return this;
      default: {
        const args = Array.from(arguments);
        const first = args.shift();
        if (args[0] instanceof Error) {
          const e = first;
          if (args.length === 0) {
            return super.debug(e);
          }
          const m = args.shift();
          return super.debug(e, m, ...args);
        }
        return super.debug(first, ...args);
      }
    }
  }
  error() {
    if (this.level < AnsiLogLevels.Error) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    switch (CI_DRIVER) {
      case "azdo":
        this.writeLine(`##[error]${msg}`);
        if (stack) {
          this.writeLine(red(stack));
        }
        return this;
      case "github":
        this.writeLine(`::error::${msg}`);
        if (stack) {
          this.writeLine(red(stack));
        }
        return this;
      default: {
        const args = Array.from(arguments);
        const first = args.shift();
        if (args[0] instanceof Error) {
          const e = first;
          if (args.length === 0) {
            return super.error(e);
          }
          const m = args.shift();
          return super.error(e, m, ...args);
        }
        return super.error(first, ...args);
      }
    }
  }
  warn() {
    if (this.level < AnsiLogLevels.Warning) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    switch (CI_DRIVER) {
      case "azdo":
        this.writeLine(`##[warning]${msg}`);
        if (stack) {
          this.writeLine(stack);
        }
        return this;
      case "github":
        this.writeLine(`::warning::${msg}`);
        if (stack) {
          this.writeLine(stack);
        }
        return this;
      default: {
        const args = Array.from(arguments);
        const first = args.shift();
        if (args[0] instanceof Error) {
          const e = first;
          if (args.length === 0) {
            return super.warn(e);
          }
          const m = args.shift();
          return super.warn(e, m, ...args);
        }
        return super.warn(first, ...args);
      }
    }
  }
}
/**
 * The global writer instance.
 */
export const writer = new DefaultPipelineWriter();
