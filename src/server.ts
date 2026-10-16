import { existsSync } from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { buildServerArgs as buildPureArgs, pickServerCommand } from "./server-resolve";

export interface ServerResolution {
  readonly command: string;
  readonly args: readonly string[];
}

export function resolveServerCommand(configuredPath: string): string {
  return pickServerCommand(configuredPath, getBundledPath());
}

export function getBundledPath(): string | undefined {
  const ext = vscode.extensions.getExtension("forgels.forgels-vscode");
  if (ext === undefined) {
    return undefined;
  }
  const candidate = path.join(ext.extensionPath, "bin", "forgels");
  if (!existsSync(candidate)) {
    return undefined;
  }
  return candidate;
}

export function buildServerArgs(): readonly string[] {
  return buildPureArgs();
}

export function resolveServer(configuredPath: string): ServerResolution {
  return {
    command: resolveServerCommand(configuredPath),
    args: buildServerArgs(),
  };
}
