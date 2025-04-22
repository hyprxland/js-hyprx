/**
 * The globals variable which is tied to `globalThis`.
 */
// deno-lint-ignore no-explicit-any
export declare const globals: typeof globalThis & Record<string, any>;

/**
 * The global defaults
 */
export declare const defaults: {
  timeout: number | undefined;
};
