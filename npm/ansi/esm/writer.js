/**
 * The `writer` module provides a simple and flexible way to write messages to the console with ANSI styles.
 * It allows you to write messages with different log levels, such as `info`, `debug`, `warn`, and `error`,
 * styled messages, log commands, and more.
 *
 * @module
 */
import { AnsiSettings } from "./settings.js";
import {
  blue,
  brightBlack,
  cyan,
  gray,
  green,
  magenta,
  red,
  reset,
  rgb24,
  yellow,
} from "./styles.js";
import { get, has } from "@hyprx/env";
import { sprintf } from "@hyprx/fmt/printf";
import { AnsiLogLevels, AnsiModes } from "./enums.js";
import { globals, WINDOWS } from "./globals.js";
import { stdout } from "@hyprx/process/streams";
const groupSymbol =
  "\x1b[38;2;60;0;255m❯\x1b[39m\x1b[38;2;90;0;255m❯\x1b[39m\x1b[38;2;121;0;255m❯\x1b[39m\x1b[38;2;151;0;255m❯\x1b[39m\x1b[38;2;182;0;255m❯\x1b[39m";
const EOL = WINDOWS ? "\r\n" : "\n";
let args = [];
if (typeof globals.Deno !== "undefined") {
  args = globals.Deno.args;
} else if (typeof globals.process !== "undefined") {
  args = globals.process.argv.slice(2);
}
function write(message) {
  stdout.writeSync(new TextEncoder().encode(message));
}
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
 * The default implementation of the ANSI writer.
 */
export class DefaultAnsiWriter {
  #interactive;
  #level;
  #write = write;
  /**
   * Creates a new instance of DefaultAnsiWriter.
   * @param level The log level.
   * @param secretMasker The secret masker.
   */
  constructor(level, write) {
    this.#level = level ?? AnsiLogLevels.Debug;
    if (write) {
      this.#write = write;
    }
  }
  /**
   * Gets or sets the log level.
   */
  get level() {
    return this.#level;
  }
  set level(value) {
    this.#level = value;
  }
  /**
   * Determines if the log level is enabled.
   * @param level The log level.
   * @returns `true` if the log level is enabled, `false` otherwise.
   */
  enabled(level) {
    return this.#level >= level;
  }
  /**
   * Determines if the current environment is interactive.
   */
  get interactive() {
    if (this.#interactive !== undefined) {
      return this.#interactive;
    }
    if (get("CI") === "true") {
      this.#interactive = false;
      return false;
    }
    const isCi = [
      "CI",
      "GITHUB_ACTIONS",
      "GITLAB_CI",
      "CIRCLECI",
      "BITBUCKET_BUILD_NUMBER",
      "TF_BUILD",
      "JENKINS_URL",
    ].some((o) => has(o));
    if (isCi) {
      this.#interactive = false;
      return false;
    }
    if (get("DEBIAN_FRONTEND") === "noninteractive") {
      this.#interactive = false;
    }
    if (args.includes("-NonInteractive") || args.includes("--non-interactive")) {
      this.#interactive = false;
    }
    this.#interactive = true;
    return this.#interactive;
  }
  /**
   * Gets the ANSI settings.
   */
  get settings() {
    return AnsiSettings.current;
  }
  progress(name, value) {
    this.write(`${name}: ${green(value.toString().padStart(2))}% \r`);
    return this;
  }
  /**
   * Writes a command to the output.
   * @param command The executable.
   * @param args The arguments passed to the command.
   * @returns The writer.
   */
  command(command, args) {
    if (this.level === AnsiLogLevels.None) {
      return this;
    }
    if (this.settings.mode >= AnsiModes.EightBit) {
      this.write(cyan("❱ $ "));
      this.write(rgb24(`${command}`, 0xff8700));
      if (args && args.length > 0) {
        for (const value of args) {
          if (value.startsWith("-") || value.startsWith("/")) {
            this.write(" ").write(cyan(`${value}`));
            continue;
          }
          if (value.includes(" ") || value.includes("\n") || value.includes("\t")) {
            if (!value.includes("'")) {
              this.write(" ").write(magenta(`'${value}'`));
            } else {
              this.write(" ").write(magenta(`"${value}"`));
            }
            continue;
          }
          this.write(` ${value}`);
        }
      }
      this.writeLine();
      return this;
    }
    this.write(`❱ $ ${command}`);
    if (args && args.length > 0) {
      for (const value of args) {
        if (value.startsWith("-") || value.startsWith("/")) {
          this.write(` ${value}`);
          continue;
        }
        if (value.includes(" ") || value.includes("\n") || value.includes("\t")) {
          if (!value.includes("'")) {
            this.write(` '${value}'`);
          } else {
            this.write(` "${value}"`);
          }
          continue;
        }
        this.write(` ${value}`);
      }
    }
    this.writeLine();
    return this;
  }
  trace() {
    if (this.#level < AnsiLogLevels.Trace) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    if (this.settings.mode !== AnsiModes.None) {
      if (this.settings.mode >= AnsiModes.EightBit) {
        this.write(rgb24("❱ [TRACE]: ", 0x626262));
      } else {
        this.write(brightBlack("❱ [TRACE]: "));
      }
      this.writeLine(msg);
      if (stack) {
        this.writeLine(stack);
      }
      return this;
    }
    this.writeLine(`❱ [TRACE]:  ${msg}`);
    if (stack) {
      this.writeLine(stack);
    }
    return this;
  }
  debug() {
    if (this.#level < AnsiLogLevels.Debug) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    if (this.settings.mode !== AnsiModes.None) {
      if (this.settings.mode >= AnsiModes.EightBit) {
        this.write(rgb24("❱ [DEBUG]: ", 0x808080));
      } else {
        this.write(gray("❱ [DEBUG]: "));
      }
      this.writeLine(msg);
      if (stack) {
        this.writeLine(stack);
      }
      return this;
    }
    this.writeLine(`❱ [DEBUG]:  ${msg}`);
    if (stack) {
      this.writeLine(stack);
    }
    return this;
  }
  warn() {
    if (this.#level < AnsiLogLevels.Warning) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    if (this.settings.mode !== AnsiModes.None) {
      if (this.settings.mode >= AnsiModes.EightBit) {
        this.write(rgb24("❱ [WARN]:  ", 0xff8700));
      } else {
        this.write(yellow("❱ [WARN]:  "));
      }
      this.writeLine(msg);
      if (stack) {
        this.writeLine(stack);
      }
      return this;
    }
    this.writeLine(`❱ [WARN]:  ${msg}`);
    if (stack) {
      this.writeLine(stack);
    }
    return this;
  }
  error() {
    if (this.#level < AnsiLogLevels.Error) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    if (this.settings.mode !== AnsiModes.None) {
      if (this.settings.mode >= AnsiModes.EightBit) {
        this.write(rgb24("❱ [ERROR]: ", 0xff0000));
      } else {
        this.write(red("❱ [ERROR]: "));
      }
      this.writeLine(msg);
      if (stack) {
        this.writeLine(stack);
      }
      return this;
    }
    this.writeLine(`❱ [ERROR]: ${msg}`);
    if (stack) {
      this.writeLine(stack);
    }
    return this;
  }
  /**
   * Writes a success message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns The writer.
   */
  success(message, ...args) {
    switch (arguments.length) {
      case 0:
        return this;
      case 1:
        {
          if (this.settings.mode !== AnsiModes.None) {
            this.writeLine(green(`${message}`));
          } else {
            this.writeLine(`${message}`);
          }
        }
        return this;
      default: {
        if (this.settings.mode !== AnsiModes.None) {
          this.writeLine(green(`${sprintf(message, ...args)}`));
        } else {
          this.writeLine(`${sprintf(message, ...args)}`);
        }
        return this;
      }
    }
  }
  info() {
    if (this.#level < AnsiLogLevels.Information) {
      return this;
    }
    const { msg, stack } = handleArguments(arguments);
    if (this.settings.mode !== AnsiModes.None) {
      if (this.settings.mode >= AnsiModes.EightBit) {
        this.write(rgb24("❱ [INFO]:  ", 0x00afff));
      } else {
        this.write(cyan("❱ [INFO]:  "));
      }
      this.writeLine(msg);
      if (stack) {
        this.writeLine(stack);
      }
      return this;
    }
    this.writeLine(`❱ [INFO]:  ${msg}`);
    if (stack) {
      this.writeLine(stack);
    }
    return this;
  }
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
  style(message, ...styles) {
    this.write(styles.reduce((acc, style) => style(acc), message));
  }
  /**
   * Writes a styled message as a new line to the output.
   * @param message The message to style.
   * @param styles The styles to apply.
   */
  styleLine(message, ...styles) {
    this.writeLine(styles.reduce((acc, style) => style(acc), message));
  }
  /**
   * Writes a message to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  write(message, ...args) {
    if (message === undefined) {
      return this;
    }
    switch (arguments.length) {
      case 0:
        return this;
      case 1:
        this.#write(message);
        break;
      default:
        {
          const formatted = sprintf(message, ...args);
          this.#write(formatted);
        }
        break;
    }
    return this;
  }
  /**
   * Writes a message as a new line to the output.
   * @param message The message to write.
   * @param args The message arguments.
   * @returns the writer.
   */
  writeLine(message, ...args) {
    switch (arguments.length) {
      case 0:
        this.#write(EOL);
        break;
      case 1:
        this.#write(`${message}${EOL}`);
        break;
      default:
        {
          const formatted = sprintf(`${message}${EOL}`, ...args);
          this.#write(formatted);
        }
        break;
    }
    return this;
  }
  /**
   * Starts a new group that groups a set of messages.
   * @param name The group name.
   * @returns the writer.
   */
  startGroup(name) {
    if (this.settings.mode !== AnsiModes.None) {
      if (this.settings.mode === AnsiModes.TwentyFourBit) {
        this.write(groupSymbol).write(reset(" "));
        this.writeLine(magenta(`${name}`));
        return this;
      }
      this.write(blue(`❯❯❯❯❯`)).write(" ");
      this.writeLine(magenta(`${name}`));
      return this;
    }
    this.writeLine(`❯❯❯❯❯ ${name}`);
    return this;
  }
  /**
   * Ends the current group.
   * @returns the writer.
   */
  endGroup() {
    this.writeLine();
    return this;
  }
}
export const writer = new DefaultAnsiWriter();
