import { Option, VerifiedOption, verifyOption } from "./args.ts";
import { assertEquals, assertThrows } from "std/testing/asserts.ts";

Deno.test("verify option - found arg", () => {
  const rawArgs = { _: ["serve"], a: "somestring" };

  const apple: Option = {
    name: "apple",
    alias: "a",
    required: true,
    default: "default string",
    type: "string",
    description: "bye bye doctor",
  };

  const verifiedApple: VerifiedOption = {
    name: apple.name,
    value: rawArgs.a,
  };
  const result = verifyOption(rawArgs)(apple);

  assertEquals(result, verifiedApple);
});

Deno.test("verify option - required, not found", () => {
  const rawArgs = { _: ["serve"] };

  const apple: Option = {
    name: "apple",
    alias: "a",
    required: true,
    type: "string",
    description: "bye bye doctor",
  };

  assertThrows(() => verifyOption(rawArgs)(apple), Error);
});

Deno.test("verify option - use default", () => {
  const rawArgs = { _: ["serve"], a: true };

  const apple: Option = {
    name: "apple",
    alias: "a",
    required: true,
    default: "default string",
    type: "string",
    description: "bye bye doctor",
  };

  const verifiedApple: VerifiedOption = {
    name: apple.name,
    value: apple.default as string,
  };
  const result = verifyOption(rawArgs)(apple);

  assertEquals(result, verifiedApple);
});

Deno.test("verify option - type mismatch", () => {
  const rawArgs = { _: ["serve"], a: 123 };

  const apple: Option = {
    name: "apple",
    alias: "a",
    required: true,
    default: "default string",
    type: "string",
    description: "bye bye doctor",
  };

  assertThrows(() => verifyOption(rawArgs)(apple), Error);
});
