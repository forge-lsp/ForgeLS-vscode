import { describe, expect, test } from "bun:test";
import { getDefaultConfig, parseConfig } from "./config";
import { DEFAULT_SERVER_VERSION } from "./server-download";

describe("config", () => {
  test("defaults enable solidity only", () => {
    const cfg = getDefaultConfig();
    expect(cfg.enableSolidity).toBe(true);
    expect(cfg.enableCairo).toBe(false);
    expect(cfg.trace).toBe("off");
    expect(cfg.serverPath).toBe("");
    expect(cfg.serverVersion).toBe(DEFAULT_SERVER_VERSION);
    expect(cfg.autoDownload).toBe(true);
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

  test("parseConfig trims serverPath and keeps defaults for missing keys", () => {
    const store = new Map<string, unknown>([["serverPath", "  /tmp/forgels  "]]);
    const cfg = parseConfig((key: string): unknown => store.get(key));
    expect(cfg.serverPath).toBe("/tmp/forgels");
    expect(cfg.trace).toBe("off");
    expect(cfg.enableSolidity).toBe(true);
    expect(cfg.enableCairo).toBe(false);
    expect(cfg.enableNoir).toBe(false);
    expect(cfg.enableMove).toBe(false);
  });

  test("parseConfig accepts all toggles and messages trace", () => {
    const store = new Map<string, unknown>([
      ["trace", "messages"],
      ["enableSolidity", false],
      ["enableCairo", true],
      ["enableNoir", true],
      ["enableMove", true],
    ]);
    const cfg = parseConfig((key: string): unknown => store.get(key));
    expect(cfg.trace).toBe("messages");
    expect(cfg.enableSolidity).toBe(false);
    expect(cfg.enableCairo).toBe(true);
    expect(cfg.enableNoir).toBe(true);
    expect(cfg.enableMove).toBe(true);
  });

  test("parseConfig falls back for non-boolean toggles", () => {
    const store = new Map<string, unknown>([
      ["enableSolidity", 1],
      ["enableCairo", "true"],
      ["enableNoir", null],
      ["enableMove", 0],
    ]);
    const cfg = parseConfig((key: string): unknown => store.get(key));
    expect(cfg.enableSolidity).toBe(true);
    expect(cfg.enableCairo).toBe(false);
    expect(cfg.enableNoir).toBe(false);
    expect(cfg.enableMove).toBe(false);
  });

  test("parseConfig reads server version and auto download", () => {
    const store = new Map<string, unknown>([
      ["serverVersion", "v0.1.0-pre1"],
      ["autoDownload", false],
    ]);
    const cfg = parseConfig((key: string): unknown => store.get(key));
    expect(cfg.serverVersion).toBe("v0.1.0-pre1");
    expect(cfg.autoDownload).toBe(false);
  });

  test("parseConfig falls back for blank version and bad flag", () => {
    const store = new Map<string, unknown>([
      ["serverVersion", "   "],
      ["autoDownload", "yes"],
    ]);
    const cfg = parseConfig((key: string): unknown => store.get(key));
    expect(cfg.serverVersion).toBe(DEFAULT_SERVER_VERSION);
    expect(cfg.autoDownload).toBe(true);
  });
});
