import { describe, expect, test } from "bun:test";
import { getDefaultConfig, parseConfig } from "./config";

describe("config", () => {
  test("defaults enable solidity only", () => {
    const cfg = getDefaultConfig();
    expect(cfg.enableSolidity).toBe(true);
    expect(cfg.enableCairo).toBe(false);
    expect(cfg.trace).toBe("off");
    expect(cfg.serverPath).toBe("");
  });

  test("parseConfig narrows unknown input with fallback", () => {
    const store = new Map<string, unknown>([
      ["serverPath", 42],
      ["trace", "invalid"],
      ["enableSolidity", "yes"],
    ]);
    const cfg = parseConfig((key: string): unknown => store.get(key));
    expect(cfg.serverPath).toBe("");
    expect(cfg.trace).toBe("off");
    expect(cfg.enableSolidity).toBe(true);
  });

  test("parseConfig accepts valid values", () => {
    const store = new Map<string, unknown>([
      ["serverPath", "/usr/local/bin/forgels"],
      ["trace", "verbose"],
      ["enableSolidity", true],
    ]);
    const cfg = parseConfig((key: string): unknown => store.get(key));
    expect(cfg.serverPath).toBe("/usr/local/bin/forgels");
    expect(cfg.trace).toBe("verbose");
  });
});
