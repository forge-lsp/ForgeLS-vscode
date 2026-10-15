import * as vscode from "vscode";
import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
} from "vscode-languageclient/node";
import type { ForgelsConfig } from "./config";
import { getActiveLanguageIds } from "./languages";
import { resolveServer } from "./server";

let client: LanguageClient | undefined;

function buildDocumentSelector(config: ForgelsConfig): Array<{ language: string }> {
  const ids = getActiveLanguageIds({
    enableSolidity: config.enableSolidity,
    enableCairo: config.enableCairo,
    enableNoir: config.enableNoir,
    enableMove: config.enableMove,
  });
  return ids.map((id) => ({ language: id }));
}

function buildClientOptions(
  config: ForgelsConfig,
  output: vscode.OutputChannel,
): LanguageClientOptions {
  return {
    documentSelector: buildDocumentSelector(config),
    outputChannel: output,
    traceOutputChannel: output,
  };
}

function buildServerOptions(config: ForgelsConfig): ServerOptions {
  const resolved = resolveServer(config.serverPath);
  return {
    command: resolved.command,
    args: [...resolved.args],
    options: { shell: false },
  };
}

export function isStarted(): boolean {
  return client !== undefined;
}

export async function startClient(
  context: vscode.ExtensionContext,
  config: ForgelsConfig,
): Promise<void> {
  if (client !== undefined) {
    return;
  }
  const output = vscode.window.createOutputChannel("ForgeLS");
  context.subscriptions.push(output);
  const serverOptions = buildServerOptions(config);
  const clientOptions = buildClientOptions(config, output);
  const next = new LanguageClient("forgels", "ForgeLS", serverOptions, clientOptions);
  client = next;
  await next.start();
}

export async function stopClient(): Promise<void> {
  const current = client;
  if (current === undefined) {
    return;
  }
  client = undefined;
  await current.stop();
}

export async function restartClient(
  context: vscode.ExtensionContext,
  config: ForgelsConfig,
): Promise<void> {
  await stopClient();
  await startClient(context, config);
}
