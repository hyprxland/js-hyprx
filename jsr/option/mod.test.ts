import { test } from "@hyprx/testing";
import { equal, ok, throws } from "@hyprx/assert";
import { from, none, OptionError, some } from "./mod.ts";

test("option::some", () => {
    const option = some(42);
    ok(option.isSome);
    ok(option.unwrap() === 42);
});

test("option::none", () => {
    const option = none();
    ok(option.isNone);
    ok(() => option.unwrap(), "Option is None");
});

test("option::from", () => {
    const option = from(42);
    const other = from<number>(null);
    equal(option.unwrap(), 42);
    throws(() => other.unwrap(), OptionError, "Option is None");
});

test("option::Option.and", () => {
    const option = some(42);
    const other = some(43);
    ok(option.and(other).unwrap() === 43);
});

test("option::Option.andThen", () => {
    const option = some(42);
    const other = some(43);
    ok(option.andThen(() => other).unwrap() === 43);
});

test("option::Option.or", () => {
    const option = some(42);
    const other = some(43);
    ok(option.or(other).unwrap() === 42);
});

test("option::Option.orElse", () => {
    const option = some(42);
    const other = some(43);
    ok(option.orElse(() => other).unwrap() === 42);
});

test("option::Option.expect", () => {
    const option = some(42);
    equal(option.expect("Option is None"), 42);

    const other = none<number>();
    throws(() => other.expect("Option is None"), OptionError, "Option is None");
});

test("option::Option.map", () => {
    const option = some(42);
    const other = option.map((value) => value + 1);
    ok(other.unwrap() === 43);
});

test("option::Option.inspect", () => {
    let value = 0;
    const option = some(42);
    option.inspect((v) => value = v);
    ok(value === 42);

    value = 0;
    const other = none<number>();
    other.inspect((v) => value = v);
    ok(value === 0);
});

test("option::Option.unwrap", () => {
    const option = some(42);
    equal(option.unwrap(), 42);

    const other = none<number>();
    throws(() => other.unwrap(), OptionError, "Option is None");
});

test("option::Option.unwrapOr", () => {
    const option = some(42);
    equal(option.unwrapOr(0), 42);

    const other = none<number>();
    equal(other.unwrapOr(0), 0);
});

test("option::Option.unwrapOrElse", () => {
    const option = some(42);
    equal(option.unwrapOrElse(() => 0), 42);

    const other = none<number>();
    equal(other.unwrapOrElse(() => 0), 0);
});

test("option::Option.zip", () => {
    const option = some(42);
    const other = some(43);
    const zipped = option.zip(other);
    ok(zipped.isSome);
    equal(zipped.unwrap(), [42, 43]);

    const noneOption = none<number>();
    const noneOther = some(43);
    const noneZipped = noneOption.zip(noneOther);
    ok(noneZipped.isNone);
});
