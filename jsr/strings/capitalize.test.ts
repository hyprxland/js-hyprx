import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { capitalize } from "./capitalize.ts";

test("strings::capitalize", () => {
    equal("Hello_world", capitalize("hello_world"));
    equal("Helloworld", capitalize("HELLoWorld"));
    equal("Hello-world", capitalize("HELLo-World"));
    equal("Hello world", capitalize("hello world"));

    equal("Bob the og", capitalize("Bob The OG"));
});
