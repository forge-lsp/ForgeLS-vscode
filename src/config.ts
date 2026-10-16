export type TraceLevel = "off" | "messages" | "verbose";

export interface ForgelsConfig {
  readonly serverPath: string;
  readonly serverVersion: string;
  readonly autoDownload: boolean;
  readonly trace: TraceLevel;
  readonly enableSolidity: boolean;
  readonly enableCairo: boolean;
  readonly enableNoir: boolean;
  readonly enableMove: boolean;
}

import { DEFAULT_SERVER_VERSION } from "./server-download";

export function getDefaultConfig(): ForgelsConfig {
  return {
    serverPath: "",
    serverVersion: DEFAULT_SERVER_VERSION,
    autoDownload: true,
    trace: "off",
    enableSolidity: true,
    enableCairo: false,
    enableNoir: false,
    enableMove: false,
  };
}

function isTraceLevel(value: unknown): value is TraceLevel {
  return value === "off" || value === "messages" || value === "verbose";
}

function readString(get: (key: string) => unknown, key: string, fallback: string): string {
  const raw = get(key);
  if (typeof raw === "string") {
    return raw;
  }
  return fallback;
}

function readBool(get: (key: string) => unknown, key: string, fallback: boolean): boolean {
  const raw = get(key);
  if (typeof raw === "boolean") {
    return raw;
  }
  return fallback;
}

export function parseConfig(get: (key: string) => unknown): ForgelsConfig {
  const defaults = getDefaultConfig();
  const traceRaw = get("trace");
  const trace: TraceLevel = isTraceLevel(traceRaw) ? traceRaw : defaults.trace;
  const versionRaw = readString(get, "serverVersion", defaults.serverVersion).trim();
  return {
    serverPath: readString(get, "serverPath", defaults.serverPath).trim(),
    serverVersion: versionRaw.length > 0 ? versionRaw : defaults.serverVersion,
    autoDownload: readBool(get, "autoDownload", defaults.autoDownload),
    trace,
    enableSolidity: readBool(get, "enableSolidity", defaults.enableSolidity),
    enableCairo: readBool(get, "enableCairo", defaults.enableCairo),
    enableNoir: readBool(get, "enableNoir", defaults.enableNoir),
    enableMove: readBool(get, "enableMove", defaults.enableMove),
  };
}
