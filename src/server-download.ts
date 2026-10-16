import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const GITHUB_OWNER = "forge-lsp";

export const GITHUB_REPO = "ForgeLS";

export const DEFAULT_SERVER_VERSION = "v0.1.0-pre1";

export function findServerBinary(dir: string, name: string): string | undefined {
  const direct = [join(dir, name), join(dir, "bin", name)];
  for (const candidate of direct) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  let entries: readonly string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return undefined;
  }
  for (const entry of entries) {
    const nested = join(dir, entry, name);
    if (existsSync(nested)) {
      return nested;
    }
  }
  return undefined;
}

export type AssetTriple = string;

export function getAssetTriple(platform: string, arch: string): AssetTriple | undefined {
  if (platform === "darwin" && arch === "arm64") {
    return "aarch64-apple-darwin";
  }
  if (platform === "darwin" && arch === "x64") {
    return "x86_64-apple-darwin";
  }
  if (platform === "linux" && arch === "x64") {
    return "x86_64-unknown-linux-gnu";
  }
  if (platform === "linux" && arch === "arm64") {
    return "aarch64-unknown-linux-gnu";
  }
  if (platform === "win32" && arch === "x64") {
    return "x86_64-pc-windows-msvc";
  }
  return undefined;
}

export function buildDownloadUrl(version: string, triple: AssetTriple): string {
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${version}/forgels-${triple}.tar.gz`;
}

export interface RedirectResponse {
  readonly url: string;
}

export async function resolveLatestVersion(
  fetchRedirect: (url: string) => Promise<RedirectResponse>,
): Promise<string | undefined> {
  try {
    const target = await fetchRedirect(
      `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`,
    );
    const tag = /\/releases\/tag\/([^/]+)\/?$/.exec(target.url)?.[1];
    if (tag === undefined || tag.length === 0) {
      return undefined;
    }
    return tag;
  } catch {
    return undefined;
  }
}
