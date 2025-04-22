# @hyprx/testing

## Overview

An adapter for the builtin Deno, Bun, and NodeJs testing frameworks which is useful for library
authors that are targeting multiple JavaScript runtimes.

The library provides a standard subset to run tests against all 3 runtimes rather than implement all
features and test styles until node:test is available in all three testing runtimes.

![logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)

[![JSR](https://jsr.io/badges/@hyprx/testing)](https://jsr.io/@hyprx/testing)
[![npm version](https://badge.fury.io/js/@hyprx%2Ftesting.svg)](https://badge.fury.io/js/@hyprx%2Ftesting)
[![GitHub version](https://badge.fury.io/gh/hyperland%2Fjs-hyperx.svg)](https://badge.fury.io/gh/hyperland%2Fjs-hyprx)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@hyprx/testing/doc)

## Usage

psuedo code to show off the test function.

```typescript
import { test } from "@hyprx/testing";

test("simple", () => {
    console.log("test");
});

test("use done", (_, done) => {
    done(); // finishes the test.

    done(new Error()); // finishes the test and throws an error.
});

test("async", async () => {
    await Deno.writeTextFile("test.txt", test);

    await exists("test.txt");
});

test("skip", { skip: true }, () => {
    console.log("skipped test");
});

test("timeout", { timeout: 2000 }, () => {
    // the test timeout will be exceeded
    setTimeout(() => {}, 3000);
});
```

## Functions

- `test` - defines a test

## Notes

This library was written to deal with the frustration of targeting multiple JavaScript runtimes.

Vitest is cool, but it is/was heavy on the dependencies and it was failing run on
Deno outside of a very limited context.

## License

[MIT License](./LICENSE.md)
