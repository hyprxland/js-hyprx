import { test } from "@hyprx/testing";
import { equal, nope, ok } from "@hyprx/assert";
import { BROWSER, BUN, CLOUDFLARE, DENO, NODE, NODELIKE, RUNTIME } from "./js.ts";
import { globals } from "./globals.ts";

test("runtime-info::RUNTIME", () => {
    if (globals.Deno !== undefined) {
        equal(RUNTIME, "deno");
        ok(DENO, "DENO must be true");
        nope(NODE, "NODE must be false");
        nope(BUN, "BUN must be false");
        nope(CLOUDFLARE, "CLOUDFLARE must be false");
        nope(BROWSER, "BROWSER must be false");
        ok(NODELIKE, "NODELIKE must be true");
        return;
    }

    if (globals.Bun !== undefined) {
        equal(RUNTIME, "bun");
        nope(DENO, "DENO must be false");
        nope(NODE, "NODE must be false");
        ok(BUN, "BUN must be true");
        nope(CLOUDFLARE, "CLOUDFLARE must be false");
        nope(BROWSER, "BROWSER must be false");
        ok(NODELIKE);
        return;
    }

    if (globals.process !== undefined) {
        equal(RUNTIME, "node");
        nope(DENO, "DENO must be false");
        ok(NODE, "NODE must be true");
        nope(BUN, "BUN must be false");
        nope(CLOUDFLARE, "CLOUDFLARE must be false");
        nope(BROWSER, "BROWSER must be false");
        ok(NODELIKE);
        return;
    }

    const navigator = globals.navigator as unknown as Record<string, unknown> | undefined;
    const userAgent = navigator?.userAgent as string | undefined;

    const cf: boolean = (navigator && userAgent &&
        userAgent.includes("Cloudflare-Workers")) || false;

    if (cf) {
        equal(RUNTIME, "cloudflare");
        nope(DENO, "DENO must be false");
        nope(NODE, "NODE must be false");
        nope(BUN, "BUN must be false");
        ok(CLOUDFLARE, "CLOUDFLARE must be true");
        nope(BROWSER, "BROWSER must be false");
        nope(NODELIKE, "NODELIKE must be false");
        return;
    }

    if (navigator && userAgent) {
        equal(RUNTIME, "browser");
        nope(DENO, "DENO must be false");
        nope(NODE, "NODE must be false");
        nope(BUN, "BUN must be false");
        nope(CLOUDFLARE, "CLOUDFLARE must be false");
        ok(BROWSER, "BROWSER must be true");
        nope(NODELIKE, "NODELIKE must be false");
        return;
    }

    equal(RUNTIME, "unknown");
    nope(DENO, "DENO must be false");
    nope(NODE, "NODE must be false");
    nope(BUN, "BUN must be false");
    nope(CLOUDFLARE, "CLOUDFLARE must be false");
    nope(BROWSER, "BROWSER must be false");
});
