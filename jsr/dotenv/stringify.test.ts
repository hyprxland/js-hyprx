import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { stringify } from "./stringify.ts";
import { WINDOWS } from "./globals.ts";

test("dotenv::stringifyDocument", () => {
    const env = {
        "FOO": "bar",
        "BAR": "baz\n",
    };

    const source = stringify(env);
    let expected = `FOO='bar'
BAR="baz
"`;
    if (WINDOWS) {
        expected = `FOO='bar'\r\nBAR="baz\n"`;
    }

    equal(source, expected);
});
