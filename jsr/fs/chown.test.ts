import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { chown, chownSync } from "./chown.ts";
import { exec } from "./_testutils.ts";
import { join } from "@hyprx/path";
import { uid } from "./uid.ts";
import { stat } from "./stat.ts";

const testFile1 = join(import.meta.dirname!, "chown_test.txt");
const testFile2 = join(import.meta.dirname!, "chown_test2.txt");
const cu = uid();

test("chown::chown changes the owner async", { skip: (cu === null || cu !== 0) }, async () => {
    await exec("touch", [testFile2]);

    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile2]);
        await chown(testFile2, 1000, 1000);
        const o = await stat(testFile2);
        // 1000 in decimal = 0o1750 in octal
        equal(o.uid, 1000);
        equal(o.gid, 1000);
    } finally {
        await exec("rm", ["-f", testFile2]);
    }
});

test("chown::chownSync changes the owner", { skip: (cu === null || cu !== 0) }, async () => {
    await exec("touch", [testFile1]);

    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile1]);
        chownSync(testFile1, 1000, 1000);

        const o = await stat(testFile1);

        // 1000 in decimal = 0o1750 in octal
        equal(1000, o.uid);
        equal(1000, o.gid);
    } finally {
        await exec("rm", ["-f", testFile1]);
    }
});
