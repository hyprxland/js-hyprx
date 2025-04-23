import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { DefaultAnsiWriter } from "./writer.js";
import { apply, bgBlue, bold, green, rgb24 } from "./styles.js";
import { AnsiLogLevels, AnsiModes } from "./enums.js";
import { sprintf } from "@hyprx/fmt/printf";
import { WINDOWS } from "./globals.js";
const EOL = WINDOWS ? "\r\n" : "\n";
export class AnsiMemoryWriter extends DefaultAnsiWriter {
  constructor() {
    super();
    this.#data = "";
  }
  #data;
  get data() {
    return this.#data;
  }
  get lines() {
    return this.#data.split(/\r?\n/g);
  }
  write(message, ...args) {
    switch (arguments.length) {
      case 0:
        return this;
      case 1:
        this.#data += message;
        break;
      default:
        {
          const formatted = sprintf(message, ...args);
          this.#data += formatted;
        }
        break;
    }
    return this;
  }
  writeLine(message, ...args) {
    switch (arguments.length) {
      case 0:
        return this.write(EOL);
      case 1:
        this.write(`${message}${EOL}`);
        break;
      default:
        {
          const formatted = sprintf(message, ...args);
          this.write(`${formatted}${EOL}`);
        }
        break;
    }
    return this;
  }
}
test("ansi::DefaultAnsiWriter.write() should write message to output", () => {
  const writer = new AnsiMemoryWriter();
  writer.write("test");
  equal(writer.data, "test");
});
test("ansi::DefaultAnsiWriter.writeLine() should write message with newline", () => {
  const writer = new AnsiMemoryWriter();
  writer.writeLine("test");
  equal(writer.data, `test${EOL}`);
});
test("ansi::DefaultAnsiWriter.style() should apply styles to message", () => {
  const writer = new AnsiMemoryWriter();
  writer.style("test", bold, green, bgBlue);
  equal(writer.data, apply("test", bold, green, bgBlue));
});
test("ansi::DefaultAnsiWriter.debug() should write debug message when enabled", () => {
  const writer = new AnsiMemoryWriter();
  writer.level = AnsiLogLevels.Debug;
  writer.settings.mode = AnsiModes.TwentyFourBit;
  writer.debug("test");
  console.log(writer.data.replaceAll(/[\\u001B]/g, ""));
  equal(writer.lines[0], rgb24("❱ [DEBUG]: ", 0x808080) + "test");
  equal(writer.lines[0].includes("test"), true);
});
test("ansi::DefaultAnsiWriter.error() should write error message", () => {
  const writer = new AnsiMemoryWriter();
  writer.level = AnsiLogLevels.Debug;
  writer.settings.mode = AnsiModes.EightBit;
  const error = new Error("test error");
  writer.error(error);
  equal(writer.lines[0].includes("[ERROR]"), true);
  equal(writer.lines[0].includes("test error"), true);
});
test("ansi::DefaultAnsiWriter.info() should write info message", () => {
  const writer = new AnsiMemoryWriter();
  writer.level = AnsiLogLevels.Debug;
  writer.settings.mode = AnsiModes.EightBit;
  writer.info("test info");
  equal(writer.lines[0].includes("[INFO]"), true);
  equal(writer.lines[0].includes("test info"), true);
});
test("ansi::DefaultAnsiWriter.warn() should write warning message", () => {
  const writer = new AnsiMemoryWriter();
  writer.level = AnsiLogLevels.Debug;
  writer.settings.mode = AnsiModes.EightBit;
  writer.warn("test warning");
  equal(writer.lines[0].includes("[WARN]"), true);
  equal(writer.lines[0].includes("test warning"), true);
});
test("ansi::DefaultAnsiWriter.success() should write success message", () => {
  const writer = new AnsiMemoryWriter();
  writer.level = AnsiLogLevels.Debug;
  writer.settings.mode = AnsiModes.EightBit;
  writer.success("test success");
  equal(writer.lines[0].includes("test success"), true);
});
test("ansi::DefaultAnsiWriter.startGroup() should start message group", () => {
  const writer = new AnsiMemoryWriter();
  writer.level = AnsiLogLevels.Debug;
  writer.settings.mode = AnsiModes.EightBit;
  writer.startGroup("test group");
  equal(writer.lines[0].includes("❯❯❯❯❯"), true);
  equal(writer.lines[0].includes("test group"), true);
});
test("ansi::DefaultAnsiWriter.command() should write command", () => {
  const writer = new AnsiMemoryWriter();
  writer.level = AnsiLogLevels.Debug;
  writer.settings.mode = AnsiModes.EightBit;
  writer.command("npm", ["install", "--save"]);
  equal(writer.lines[0].includes("npm"), true);
  equal(writer.lines[0].includes("install"), true);
  equal(writer.lines[0].includes("--save"), true);
});
