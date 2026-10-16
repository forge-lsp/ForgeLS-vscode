import { describe, expect, test } from "bun:test";
import { buildServerArgs, pickServerCommand } from "./server-resolve";

describe("server-resolve", () => {
  test("configured path wins over bundled", () => {
    expect(pickServerCommand("  /tmp/forgels  ", "/bundled/forgels")).toBe("/tmp/forgels");
  });

  test("bundled used when configured empty", () => {
    expect(pickServerCommand("", "/bundled/forgels")).toBe("/bundled/forgels");
    expect(pickServerCommand("   ", "/bundled/forgels")).toBe("/bundled/forgels");
  });

  test("falls back to PATH when both missing", () => {
    expect(pickServerCommand("", undefined)).toBe("forgels");
    expect(pickServerCommand("  ", "  ")).toBe("forgels");
  });

  test("args empty for now", () => {
    expect(buildServerArgs()).toEqual([]);
  });
});
