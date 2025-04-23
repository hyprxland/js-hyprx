# @hyprx/result

## Overview

The '@hyprx/result' module provides the `Result<T,E>` type with functions ok, fail,
tryCatch, and tryCatchSync which are all used to help deal with returning results
or errors.

![logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)

[![JSR](https://jsr.io/badges/@hyprx/result)](https://jsr.io/@hyprx/result)
[![npm version](https://badge.fury.io/js/@hyprx%2Fresult.svg)](https://badge.fury.io/js/@hyprx%2Fresult)
[![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@hyprx/result/doc)

A list of other modules can be found at [github.com/hyprxland/js-hyprx](https://github.com/hyprxland/js-hyprx)

## Usage

```typescript
import { ok, fail, tryCatchSync } from "@hyprx/result";

const r = ok(10);
console.log(r.isOk);
console.log(r.isError);

console.log(r.map((v) => v.toString()));

const r1 = tryCatchSync<number>(() => {
    throw Error("test");
});

console.log(r1.isError); // true

const r2 = fail<number>(new Error("test"));
console.log(r2.isError); // true;

```

## License

[MIT License](./LICENSE.md)
