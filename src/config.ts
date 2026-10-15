export type TraceLevel = "off" | "messages" | "verbose";

export interface ForgelsConfig {
  readonly serverPath: string;
  readonly trace: TraceLevel;
  readonly enableSolidity: boolean;
  readonly enableCairo: boolean;
  readonly enableNoir: boolean;
  readonly enableMove: boolean;
}

export function getDefaultConfig(): ForgelsConfig {
  return {
    serverPath: "",
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
  return {
    serverPath: readString(get, "serverPath", defaults.serverPath).trim(),
    trace,
    enableSolidity: readBool(get, "enableSolidity", defaults.enableSolidity),
    enableCairo: readBool(get, "enableCairo", defaults.enableCairo),
    enableNoir: readBool(get, "enableNoir", defaults.enableNoir),
    enableMove: readBool(get, "enableMove", defaults.enableMove),
  };
}
