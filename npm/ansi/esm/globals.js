import { DARWIN, globals, WINDOWS } from "@hyprx/runtime-info";
export { DARWIN, globals, WINDOWS };
export function loadOsModule() {
  if (globals.Deno) {
    return undefined;
  } else if (globals.process) {
    // deno-lint-ignore no-explicit-any
    const proc = globals.process;
    if (proc.versions && proc.getBuiltinModule) {
      return proc.getBuiltinModule("node:os");
    } else if (globals.Bun && typeof require !== "undefined") {
      return require("node:os");
    }
  }
  return undefined;
}
