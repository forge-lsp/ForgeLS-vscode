import { describe, expect, test } from "bun:test";
import {
  getActiveLanguageIds,
  getLanguageTable,
  isBetaEnabled,
  isLanguageActive,
} from "./languages";

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

  test("table maps ids to extensions", () => {
    const table = getLanguageTable();
    expect(table.map((e) => e.id)).toEqual(["solidity", "cairo", "noir", "move"]);
    expect(table.find((e) => e.id === "solidity")?.extensions).toEqual([".sol"]);
    expect(table.find((e) => e.id === "noir")?.extensions).toEqual([".nr"]);
  });

  test("solidity needs toggle plus beta gate", () => {
    expect(
      isLanguageActive("solidity", {
        enableSolidity: true,
        enableCairo: false,
        enableNoir: false,
        enableMove: false,
      }),
    ).toBe(true);
    expect(
      isLanguageActive("solidity", {
        enableSolidity: false,
        enableCairo: false,
        enableNoir: false,
        enableMove: false,
      }),
    ).toBe(false);
  });

  test("future languages follow toggle only", () => {
    expect(
      isLanguageActive("cairo", {
        enableSolidity: false,
        enableCairo: true,
        enableNoir: false,
        enableMove: false,
      }),
    ).toBe(true);
    expect(
      isLanguageActive("noir", {
        enableSolidity: false,
        enableCairo: false,
        enableNoir: true,
        enableMove: false,
      }),
    ).toBe(true);
    expect(
      isLanguageActive("move", {
        enableSolidity: false,
        enableCairo: false,
        enableNoir: false,
        enableMove: true,
      }),
    ).toBe(true);
    expect(
      isLanguageActive("cairo", {
        enableSolidity: false,
        enableCairo: false,
        enableNoir: false,
        enableMove: false,
      }),
    ).toBe(false);
  });
});
