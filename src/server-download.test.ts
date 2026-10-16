import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildDownloadUrl,
  findServerBinary,
  getAssetTriple,
  resolveLatestVersion,
} from "./server-download";

describe("server-download", () => {
  test("maps supported platform and arch pairs", () => {
    expect(getAssetTriple("darwin", "arm64")).toBe("aarch64-apple-darwin");
    expect(getAssetTriple("darwin", "x64")).toBe("x86_64-apple-darwin");
    expect(getAssetTriple("linux", "x64")).toBe("x86_64-unknown-linux-gnu");
    expect(getAssetTriple("linux", "arm64")).toBe("aarch64-unknown-linux-gnu");
    expect(getAssetTriple("win32", "x64")).toBe("x86_64-pc-windows-msvc");
  });

  test("returns undefined for unsupported pairs", () => {
    expect(getAssetTriple("freebsd", "x64")).toBe(undefined);
    expect(getAssetTriple("darwin", "ia32")).toBe(undefined);
    expect(getAssetTriple("win32", "arm64")).toBe(undefined);
  });

  test("builds release asset url", () => {
    expect(buildDownloadUrl("v0.1.0-pre1", "aarch64-apple-darwin")).toBe(
      "https://github.com/forge-lsp/ForgeLS/releases/download/v0.1.0-pre1/forgels-aarch64-apple-darwin.tar.gz",
    );
  });

  test("resolves latest tag from redirect url", async () => {
    const tag = await resolveLatestVersion(async (_url: string) => ({
      url: "https://github.com/forge-lsp/ForgeLS/releases/tag/v0.1.0-pre1",
    }));
    expect(tag).toBe("v0.1.0-pre1");
  });

  test("returns undefined when offline or redirect is bare", async () => {
    const offline = await resolveLatestVersion(async (_url: string) => {
      throw new Error("offline");
    });
    expect(offline).toBe(undefined);
    const bare = await resolveLatestVersion(async (_url: string) => ({
      url: "https://github.com/forge-lsp/ForgeLS/releases/latest",
    }));
    expect(bare).toBe(undefined);
  });

  test("returns undefined for releases index url", async () => {
    const index = await resolveLatestVersion(async (_url: string) => ({
      url: "https://github.com/forge-lsp/ForgeLS/releases",
    }));
    expect(index).toBe(undefined);
  });

  test("finds top level and nested binaries", () => {
    const root = mkdtempSync(join(tmpdir(), "forgels-"));
    try {
      const top = join(root, "forgels");
      writeFileSync(top, "x");
      expect(findServerBinary(root, "forgels")).toBe(top);
      const nestedDir = join(root, "sub");
      mkdirSync(join(nestedDir, "forgels-aarch64-apple-darwin"), { recursive: true });
      const nested = join(nestedDir, "forgels-aarch64-apple-darwin", "forgels");
      writeFileSync(nested, "x");
      expect(findServerBinary(nestedDir, "forgels")).toBe(nested);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("returns undefined when dir is missing", () => {
    expect(findServerBinary(join(tmpdir(), "forgels-nope-missing"), "forgels")).toBe(undefined);
  });
});
