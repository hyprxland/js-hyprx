/**
 * The reference to the `globalThis` object and makes it
 * possible to access the global scope in a type-safe way.
 * This is useful for accessing global variables and functions
 */
// deno-lint-ignore no-explicit-any
export const globals: typeof globalThis & Record<string | symbol, any> = globalThis;
