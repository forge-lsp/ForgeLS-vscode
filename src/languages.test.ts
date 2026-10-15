import { describe, expect, test } from "bun:test";
import { getActiveLanguageIds, isBetaEnabled } from "./languages";

describe("languages", () => {
  test("solidity is beta active", () => {
    expect(isBetaEnabled("solidity")).toBe(true);
  });

  test("future languages are not beta active", () => {
    expect(isBetaEnabled("cairo")).toBe(false);
    expect(isBetaEnabled("noir")).toBe(false);
    expect(isBetaEnabled("move")).toBe(false);
  });

  test("default toggle activates solidity only", () => {
    const ids = getActiveLanguageIds({
      enableSolidity: true,
      enableCairo: false,
      enableNoir: false,
      enableMove: false,
    });
    expect(ids).toEqual(["solidity"]);
  });

  test("all disabled yields empty selector", () => {
    const ids = getActiveLanguageIds({
      enableSolidity: false,
      enableCairo: false,
      enableNoir: false,
      enableMove: false,
    });
    expect(ids).toEqual([]);
  });
});
