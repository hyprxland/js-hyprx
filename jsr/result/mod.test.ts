import { test } from "@hyprx/testing";
import { fail, failAsError, ok, type Result } from "./mod.ts";
import { equal, instanceOf, ok as yes, throws } from "@hyprx/assert";

test("result::ok", () => {
    const result = ok(42);
    yes(result.isOk);
    yes(result.unwrap() === 42);
});

test("result::fail", () => {
    const result = fail("Error");
    yes(result.isError);
    yes(() => result.unwrap(), "Error");
});

test("result::Result.ok - ensure ok returns option", () => {
    const result = ok(42);
    yes(result.isOk);
    yes(result.ok().isSome);
    yes(result.ok().unwrap() === 42);
    yes(result.error().isNone);

    const other = fail("Error");
    yes(other.isError);
    yes(() => other.unwrap(), "Error");
    yes(other.ok().isNone);
    yes(other.error().isSome);
});

test("result::Result.and - 'and' should return other value or error", () => {
    const result = ok(42);
    const other = ok(43);
    yes(result.and(other).unwrap() === 43);
});

test("result::Result.andThen - 'andThen' should return value from factory or error.", () => {
    const result = ok(42);
    const other = ok(43);
    yes(result.andThen(() => other).unwrap() === 43);
});

test("result::Result.or - 'or' should return the first value that isn't an error.", () => {
    const result = ok(42);
    const other = ok<number, Error>(43);
    yes(result.or(other).unwrap() === 42);

    const otherResult = fail("Error") as unknown as Result<number>;
    yes(otherResult.or(other).unwrap() === 43);
});

test("result::Result.orElse", () => {
    const result = ok(42);
    const other = ok(43);
    yes(result.orElse(() => other).unwrap() === 42);
});

test("functionnal::Result.expect", () => {
    const result = ok(42);
    equal(result.expect("Result is Error"), 42);

    const other = fail("Error");

    throws(() => other.expect("Result is Error"), Error, "Result is Error");
});

test("result::Result.map", () => {
    const result = ok(42);
    const other = result.map((value) => value + 1);
    yes(other.unwrap() === 43);
});

test("result::Result.mapOr", () => {
    const result = ok(42);
    const other = result.mapOr(0, (value) => value + 1);
    yes(other === 43);

    const otherResult = fail("Error");
    const otherOther = otherResult.mapOr(0, (value) => value + 1);
    yes(otherOther === 0);
});

test("result::Result.mapOrElse", () => {
    const result = ok(42);
    const other = result.mapOrElse(() => 0, (value) => value + 1);
    yes(other === 43);

    const otherResult = fail("Error");
    const otherOther = otherResult.mapOrElse(() => 0, (value) => value + 1);
    yes(otherOther === 0);
});

test("result::Result.mapError", () => {
    const result = fail("Error");
    const other = result.mapError((error) => error + "!");
    yes(other.unwrapError() === "Error!");
});

test("result::Result.mapErrorOr", () => {
    const result = fail("Error");
    const other = result.mapErrorOr("Default", (error) => error + "!");
    yes(other === "Error!");

    const otherResult = ok(42);
    const otherOther = otherResult.mapErrorOr("Default", (error) => error + "!");
    yes(otherOther === "Default");
});

test("result::Result.mapErrorOrElse", () => {
    const result = fail("Error");
    const other = result.mapErrorOrElse(() => "Default", (error) => error + "!");
    yes(other === "Error!");

    const otherResult = ok(42);
    const otherOther = otherResult.mapErrorOrElse(() => "Default", (error) => error + "!");
    yes(otherOther === "Default");
});

test("result::Result.inspect", () => {
    let value = 0;
    const result = ok(42);
    result.inspect((v) => value = v);
    yes(value === 42);

    value = 0;
    const other = fail("Error");
    other.inspect((v) => value = v);
    yes(value === 0);
});

test("result::Result.unwrap", () => {
    const result = ok(42);
    equal(result.unwrap(), 42);

    const other = fail("Error");
    throws(() => other.unwrap(), Error, "Error");
});

test("result::Result.unwrapOr", () => {
    const result = ok(42);
    equal(result.unwrapOr(0), 42);

    const other = fail<number, string>("Error");
    equal(other.unwrapOr(0), 0);
});

test("result::Result.unwrapOrElse", () => {
    const result = ok(42);
    equal(result.unwrapOrElse(() => 0), 42);

    const other = fail<number, string>("Error");
    equal(other.unwrapOrElse(() => 0), 0);
});

test("result::Result.unwrapError", () => {
    const result = fail("Error");
    equal(result.unwrapError(), "Error");

    const other = ok(42);
    throws(() => other.unwrapError(), Error, "Result is Ok");
});

test("result::Result.expectError", () => {
    const result = fail("Error");
    equal(result.expectError("Result is Ok"), "Error");

    const other = ok(42);
    throws(() => other.expectError("Result is Ok"), Error, "Result is Ok");
});

test("result::failAsError", () => {
    const result = failAsError("Error");
    const e = result.unwrapError();
    instanceOf(e, Error);
    equal(e.message, "Error");

    const result2 = failAsError(42);
    const e2 = result2.unwrapError();
    instanceOf(e2, Error);
    equal(e2.message, "Unexpected error: 42");
});
