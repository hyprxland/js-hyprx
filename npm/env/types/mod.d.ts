/**
 * ## Overview
 *
 * The env provides a uniform way to work with environment variables and
 * the path variable across different runtimes such as bun, node, deno,
 * cloudflare and the browser and different operating system differences.
 *
 * Cloudflare and the brower uses an in memory store.
 *
 * Bash and Windows style variable expansion is included. The env
 * object provides additional methods to convert values to boolean,
 * int, number, json, etc.
 *
 * ![logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/env)](https://jsr.io/@hyprx/env)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Fenv.svg)](https://badge.fury.io/js/@hyprx%2Fenv)
 * [![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/env/doc)
 *
 * A list of other modules can be found at [github.com/hyprxland/js-hyprx](https://github.com/hyprxland/js-hyprx)
 *
 * ## Usage
 *
 * ```typescript
 * import * as  env from "@hyprx/env";
 *
 * // get values
 * console.log(env.get("USER") || env.get("USERNAME"));
 *
 * // set variable
 * env.set("MY_VAR", "test")
 * console.log(env.get("MY_VAR"))
 *
 * // expansion
 * console.log(env.expand("${MY_VAR}")); // test
 * console.log(env.expand("${NO_VALUE:-default}")); // default
 * console.log(env.get("NO_VALUE")); // undefined
 *
 * env.expand("${NO_VALUE:=default}"); // default
 * console.log(env.get("NO_VALUE")); // default
 *
 * try {
 *     env.expand("${REQUIRED_VAR:?Environment variable REQUIRED_VAR is missing}");
 * } catch(e) {
 *     console.log(e.message); // Environment variable REQUIRED_VAR is missing
 * }
 *
 * // proxy object to allow get/set/delete similar to process.env
 * console.log(env.proxy.MY_VAR);
 * env.proxy.MY_VAR = "test"
 * console.log(env.proxy.MY_VAR)
 *
 * // undefined will remove a value
 * env.merge({
 *     "VAR2": "VALUE",
 *     "MY_VAR2": undefined
 * });
 *
 * // union only sets values that are not undefined and does not already have a value
 * // in the example below only NEW will be set.
 * env.union({
 *     "VAR2": undefined,
 *     "NEW": "TEST",
 *     "MY_VAR": "A"
 * })
 *
 * env.set("MY_VAR", "test")
 * env.remove("MY_VAR");
 *
 * // append to the end of the environment path variables
 * env.appendPath("/opt/test/bin");
 *
 * // prepends the path
 * env.prependPath("/opt/test2/bin");
 * env.hasPath("/opt/test2/bin");
 *
 * // removes the path. on windows this is case insensitive.
 * env.removePath("/opt/test2/bin");
 *
 * // replaces the path.
 * env.replacePath("/opt/test/bin", "/opt/test2/bin")
 *
 * console.log(env.splitPath());
 * console.log(env.getPath()) // the full path string
 *
 * const path = env.getPath();
 * // overwrites the environment's PATH variable
 * env.setPath(`${path}:/opt/test4/bin`)
 * ```
 *
 * ## Variables
 *
 * - `proxy` - A proxy object that lets you interact with environment
 *   variables the way you would with `process.env`.
 *
 * ## Functions
 *
 * - `appendPath` - Appends a path to the PATH environment variable.
 * - `expand` - Expands string template with environment variables.
 * - `get` - Gets an environment variable.
 * - `getPath` - Gets the environment PATH value.
 * - `has` - Determines if an environment variable is set.
 * - `hasPath` - Determines if the PATH variable contains a path.
 * - `home` - Gets the home environment variable value.
 * - `hostname` - Gets the hostname environment variable value.
 * - `joinPath` - Joins paths into a single string.
 * - `merge` - Merges the values from an object into the environment variables.
 * - `prependPath` - Prepends a path to the PATH variable.
 * - `set` - Sets an environment variable.
 * - `setPath` - Sets the environment's PATH value.
 * - `remove` - Deletes an environment variable.
 * - `removePath` - Removes a path from the environment PATH value.
 * - `replacePath` - Replaces a path from the environment PATH value.
 * - `splitPath` - Splits the PATH variable into a string array.
 * - `shell` - Gets the shell environment variable value.
 * - `os` - Gets the os environment variable value.
 * - `toObject` - Clones and returns a copy of all environment values.
 * - `union` - Unions the vlaues from an object into the environment variables.
 * - `user` - Gets the user environment variable value.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 * @module
 */
export * from "./core.js";
