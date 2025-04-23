import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { DotEnvDocument } from "./document.ts";
import { stringifyDocument } from "./stringify_document.ts";
import { WINDOWS } from "./globals.ts";

test("dotenv::stringifyDocument", () => {
    const doc = new DotEnvDocument();
    doc.comment("comment=1");
    doc.newline();
    doc.item("FOO", "bar");
    doc.item("BAR", "baz\n");
    doc.newline();
    console.log(doc.toArray());

    const source = stringifyDocument(doc);
    let expected = `#comment=1

FOO='bar'
BAR="baz
"
`;
    if (WINDOWS) {
        expected = `#comment=1\r\n\r\nFOO='bar'\r\nBAR="baz\n"\r\n`;
    }

    equal(source, expected);
});
