import { test } from "@hyprx/testing";
import { DefaultPipelineWriter, handleArguments } from "./writer.js";
import { equal, instanceOf, ok } from "@hyprx/assert";
import { AnsiLogLevels } from "@hyprx/ansi";
import { CI_DRIVER } from "./driver.js";
import { EOL } from "@hyprx/runtime-info/os";
test("handleArguments with no args returns undefined msg and stack", () => {
  function test() {
    return handleArguments(arguments);
  }
  const result = test();
  equal(result.msg, undefined);
  equal(result.stack, undefined);
});
test("handleArguments with error returns error message and stack", () => {
  const error = new Error("test error");
  function test2(..._args) {
    return handleArguments(arguments);
  }
  const result = test2(error);
  equal(result.msg, "test error");
  ok(result.stack?.includes("writer.test"));
});
test("DefaultPipelineWriter constructor", () => {
  const writer = new DefaultPipelineWriter();
  instanceOf(writer, DefaultPipelineWriter);
  equal(writer.level, AnsiLogLevels.Information);
});
test("DefaultPipelineWriter debug output format", () => {
  let output = "";
  const writer = new DefaultPipelineWriter(AnsiLogLevels.Debug, (msg) => {
    output += msg ?? "";
  });
  writer.debug("test message");
  if (CI_DRIVER === "github") {
    equal(output, `::debug::test message${EOL}`);
  } else if (CI_DRIVER === "azdo") {
    equal(output, `##[debug]test message${EOL}`);
  }
});
test("DefaultPipelineWriter error output format", () => {
  let output = "";
  const writer = new DefaultPipelineWriter(AnsiLogLevels.Error, (msg) => {
    output += msg ?? "";
  });
  writer.error("test error");
  if (CI_DRIVER === "github") {
    equal(output, `::error::test error${EOL}`);
  } else if (CI_DRIVER === "azdo") {
    equal(output, `##[error]test error${EOL}`);
  }
});
test("DefaultPipelineWriter warn output format", () => {
  let output = "";
  const writer = new DefaultPipelineWriter(AnsiLogLevels.Warning, (msg) => {
    output += msg ?? "";
  });
  writer.warn("test warning");
  if (CI_DRIVER === "github") {
    equal(output, `::warning::test warning${EOL}`);
  } else if (CI_DRIVER === "azdo") {
    equal(output, `##[warning]test warning${EOL}`);
  }
});
