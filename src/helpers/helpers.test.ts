import { assertEquals } from "std/testing/asserts.ts";
import { matchCreateName } from "./helpers.ts";

Deno.test("match create name - true", () => {
  const res = matchCreateName("test.md");
  assertEquals(res, true);
});
