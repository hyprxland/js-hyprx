/**
 * ## Overview
 *
 * The strings module provides case insenstive methods like `equalsIgnoreCase`,
 * `includesIgnoreCase`, `indexOfIgnoreCase`, `startsWithIgnoreCase`, and
 * `endsWithIgnoreCase` to avoid using string allocation by using comparisons with
 * toLowerCase/toUpperCase.
 *
 * A `Utf8StringBuilder` and `StringBuilder` classes are included to avoid
 * uness unnecessary allocations for building text.
 *
 * Trim methods that take other characters than whitespace for trimming a string.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import * from str from '@hyprx/strings'
 *
 * console.log(str.equalIgnoreCase("left", "LeFT")); // true
 * console.log(str.trimEnd("my random text...", ".")); // my random text
 * console.log(str.underscore("first-place")); // first_place
 *
 * // useful for FFI
 * var sb = new str.Utf8StringBuilder()
 * sb.append("test")
 *    .append(new TextEncoder().encode(": another test"));
 *
 * // faster
 * sb.appendString("test")
 *   .appendUtf8Array(new TextEncoder().encode(": another test"))
 *
 * console.log(sb.toString())
 * ```
 *
 * ## LICENSE
 *
 * [MIT License](./LICENSE.md) and additional MIT License for the
 * inflection code, see [License](./LICENSE.md) for details.
 */
export * from "./camelize.js";
export * from "./capitalize.js";
export * from "./dasherize.js";
export * from "./ends_with.js";
export * from "./equal.js";
export * from "./index_of.js";
export * from "./inflect.js";
export * from "./is_null.js";
export * from "./is_empty.js";
export * from "./is_space.js";
export * from "./is_undefined.js";
export * from "./last_index_of.js";
export * from "./pascalize.js";
export * from "./split.js";
export * from "./starts_with.js";
export * from "./string_builder.js";
export * from "./titleize.js";
export * from "./to_char_array.js";
export { trim, trimEnd, trimStart } from "./trim.js";
export * from "./underscore.js";
