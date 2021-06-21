import { assertEquals } from "std/testing/asserts.ts";
import {
  matchCreateName,
  matchReadUpdateName,
  removeExtension,
} from "./helpers.ts";

Deno.test("match create name - true", () => {
  const res = matchCreateName("test.md");
  assertEquals(res, true);
});

Deno.test("match create name - false", () => {
  const res = matchCreateName("testmd");
  assertEquals(res, false);
});

Deno.test("remove extension", () => {
  assertEquals(removeExtension("test.md"), "test");
});

Deno.test("match read update name - true", () => {
  const res = matchReadUpdateName("1==test==1/1/2020.md");
  assertEquals(res, true);
});

Deno.test("match read update name - false", () => {
  const res = matchReadUpdateName("1==test==1/1/2020.d");
  assertEquals(res, false);
});
