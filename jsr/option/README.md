# @hyprx/option

## Overview

The '@hyprx/option' module provides the `Option<T>` type with functions some, none,
and from which are all used to help deal with null and undefined values.

![logo](https://raw.githubusercontent.com/hyprxland/js-hyprx/refs/heads/main/assets/logo.png)

[![JSR](https://jsr.io/badges/@hyprx/option)](https://jsr.io/@hyprx/option)
[![npm version](https://badge.fury.io/js/@hyprx%2Foption.svg)](https://badge.fury.io/js/@hyprx%2Foption)
[![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-hyprx)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@hyprx/option/doc)

A list of other modules can be found at [github.com/hyprxland/js-hyprx](https://github.com/hyprxland/js-hyprx)

## Usage

```typescript
import { ok, some, none } from "@hyprx/functional";

const o1 = none<number>();
console.log(o1.isSome); // false 
console.log(o1.isNone); // true
console.log(o1.unwrapOrElse(() => 50)); // 50

const o = some(10);
console.log(o.isSome); // true
console.log(o.isNone); // false
o.inspect(g => console.log(g));
console.log(o.map(g => g * 60).unwrap()); // 60

```

## License

[MIT License](./LICENSE.md)
