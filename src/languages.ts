export type BetaLanguageId = "solidity";

export type FutureLanguageId = "cairo" | "noir" | "move";

export type LanguageId = BetaLanguageId | FutureLanguageId;

export interface LanguageEntry {
  readonly id: LanguageId;
  readonly extensions: readonly string[];
  readonly betaActive: boolean;
}

const TABLE: readonly LanguageEntry[] = [
  { id: "solidity", extensions: [".sol"], betaActive: true },
  { id: "cairo", extensions: [".cairo"], betaActive: false },
  { id: "noir", extensions: [".nr"], betaActive: false },
  { id: "move", extensions: [".move"], betaActive: false },
];

export function getLanguageTable(): readonly LanguageEntry[] {
  return TABLE;
}

export function isBetaEnabled(id: LanguageId): boolean {
  const found = TABLE.find((e) => e.id === id);
  if (found === undefined) {
    return false;
  }
  return found.betaActive;
}

export interface LanguageToggle {
  readonly enableSolidity: boolean;
  readonly enableCairo: boolean;
  readonly enableNoir: boolean;
  readonly enableMove: boolean;
}

export function isLanguageActive(id: LanguageId, toggle: LanguageToggle): boolean {
  switch (id) {
    case "solidity":
      return toggle.enableSolidity && isBetaEnabled(id);
    case "cairo":
      return toggle.enableCairo;
    case "noir":
      return toggle.enableNoir;
    case "move":
      return toggle.enableMove;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function getActiveLanguageIds(toggle: LanguageToggle): LanguageId[] {
  const out: LanguageId[] = [];
  for (const entry of TABLE) {
    if (isLanguageActive(entry.id, toggle)) {
      out.push(entry.id);
    }
  }
  return out;
}
