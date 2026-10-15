import * as path from "node:path";
import * as vscode from "vscode";

export interface ServerResolution {
  readonly command: string;
  readonly args: readonly string[];
}

function firstNonEmpty(values: readonly string[]): string | undefined {
  for (const v of values) {
    if (v.trim().length > 0) {
      return v.trim();
    }
  }
  return undefined;
}

export function resolveServerCommand(configuredPath: string): string {
  const picked = firstNonEmpty([configuredPath]);
  if (picked !== undefined) {
    return picked;
  }
  const bundled = getBundledPath();
  if (bundled !== undefined) {
    return bundled;
  }
  return "forgels";
}

function getBundledPath(): string | undefined {
  const ext = vscode.extensions.getExtension("forgels.forgels-vscode");
  if (ext === undefined) {
    return undefined;
  }
  const candidate = path.join(ext.extensionPath, "bin", "forgels");
  return candidate;
}

export function buildServerArgs(): readonly string[] {
  return [];
}

export function resolveServer(configuredPath: string): ServerResolution {
  return {
    command: resolveServerCommand(configuredPath),
    args: buildServerArgs(),
  };
}
