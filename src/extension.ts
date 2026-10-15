import * as vscode from "vscode";
import { restartClient, startClient, stopClient } from "./client";
import { type ForgelsConfig, parseConfig } from "./config";

function readConfigFromWorkspace(): ForgelsConfig {
  const section = vscode.workspace.getConfiguration("forgels");
  return parseConfig((key: string): unknown => section.get(key));
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const config = readConfigFromWorkspace();
  await startClient(context, config);
  const watcher = vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (!event.affectsConfiguration("forgels")) {
      return;
    }
    const next = readConfigFromWorkspace();
    await restartClient(context, next);
  });
  context.subscriptions.push(watcher);
}

export async function deactivate(): Promise<void> {
  await stopClient();
}
