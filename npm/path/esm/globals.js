import { globals } from "@hyprx/runtime-info/globals";
export { globals };
export function cwd() {
  if (globals.Deno && globals.Deno.cwd) {
    return globals.Deno.cwd();
  }
  if (globals.process && globals.process.cwd) {
    return globals.process.cwd();
  }
  if (globals.location) {
    return globals.location.href;
  }
  return "/";
}
