import { execFile } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as vscode from "vscode";
import type { ForgelsConfig } from "./config";
import { getBundledPath } from "./server";
import {
  buildDownloadUrl,
  findServerBinary,
  getAssetTriple,
  resolveLatestVersion,
} from "./server-download";

function binaryName(): string {
  return os.platform() === "win32" ? "forgels.exe" : "forgels";
}

function extractArchive(archive: string, dir: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    execFile("tar", ["-xzf", archive, "-C", dir], (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function downloadArchive(
  url: string,
  dest: string,
  token: vscode.CancellationToken,
): Promise<void> {
  const controller = new AbortController();
  const cancel = token.onCancellationRequested(() => controller.abort());
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`download failed with HTTP ${response.status}`);
    }
    writeFileSync(dest, Buffer.from(await response.arrayBuffer()));
  } finally {
    cancel.dispose();
  }
}

async function openSettings(): Promise<void> {
  await vscode.commands.executeCommand("workbench.action.openSettings", "forgels");
}

async function showError(message: string): Promise<void> {
  const picked = await vscode.window.showErrorMessage(message, "Open Settings");
  if (picked === "Open Settings") {
    await openSettings();
  }
}

async function installServer(config: ForgelsConfig, cached: string): Promise<string | undefined> {
  const triple = getAssetTriple(os.platform(), os.arch());
  if (triple === undefined) {
    await showError(
      `ForgeLS has no prebuilt binary for ${os.platform()}-${os.arch()}. Set forgels.serverPath to a local build.`,
    );
    return undefined;
  }
  const version =
    config.serverVersion === "latest" ? await resolveLatestVersion(fetch) : config.serverVersion;
  if (version === undefined) {
    await showError(
      "ForgeLS server download failed: could not resolve the latest release. Set forgels.serverVersion to a tag such as v0.1.0-pre1.",
    );
    return undefined;
  }
  const url = buildDownloadUrl(version, triple);
  const dir = path.dirname(cached);
  mkdirSync(dir, { recursive: true });
  const archive = `${cached}.tar.gz`;
  try {
    const finished = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Downloading ForgeLS ${version}`,
        cancellable: true,
      },
      async (progress, token) => {
        progress.report({ message: "downloading" });
        await downloadArchive(url, archive, token);
        if (token.isCancellationRequested) {
          return false;
        }
        progress.report({ message: "extracting" });
        await extractArchive(archive, dir);
        return true;
      },
    );
    if (!finished) {
      return undefined;
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    await showError(`ForgeLS server download failed (${url}): ${detail}`);
    return undefined;
  }
  const found = findServerBinary(dir, binaryName());
  if (found === undefined) {
    const listing = readdirSync(dir).slice(0, 10).join(", ");
    await showError(`ForgeLS archive has an unexpected layout (${url}): ${listing}`);
    return undefined;
  }
  rmSync(archive, { force: true });
  if (os.platform() !== "win32") {
    chmodSync(found, 0o755);
  }
  return found;
}

export async function ensureServer(
  context: vscode.ExtensionContext,
  config: ForgelsConfig,
): Promise<string | undefined> {
  const configured = config.serverPath.trim();
  if (configured.length > 0 && existsSync(configured)) {
    return configured;
  }
  const bundled = getBundledPath();
  if (bundled !== undefined && existsSync(bundled)) {
    return bundled;
  }
  const cached = path.join(context.globalStorageUri.fsPath, "bin", binaryName());
  if (existsSync(cached)) {
    return cached;
  }
  if (!config.autoDownload) {
    const detail = configured.length > 0 ? ` (${configured})` : "";
    await showError(
      `ForgeLS server binary not found${detail}. Set forgels.serverPath or enable forgels.autoDownload.`,
    );
    return undefined;
  }
  return installServer(config, cached);
}
