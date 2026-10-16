export function pickServerCommand(configuredPath: string, bundledPath: string | undefined): string {
  const trimmed = configuredPath.trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  if (bundledPath !== undefined && bundledPath.trim().length > 0) {
    return bundledPath.trim();
  }
  return "forgels";
}

export function buildServerArgs(): readonly string[] {
  return [];
}
