# no-warn-no-console

Scope: logging, warnings, and user messages in forgels-vscode.

## Rules

- FORBIDDEN in `src`: `console.log`, `console.warn`, `console.debug`, `console.error`, `console.info`. Tests may use `bun:test` assertions only, no console output.
- FORBIDDEN: `showWarningMessage` or `showErrorMessage` with a bare string and no next step. Every user visible message must state what happened, what the client did, and what the user can do.
- Use the `ForgeLS` output channel in `client.ts` for diagnostics flow. Demote noise to the channel. Promote to a user message only when the user must act (missing binary, repeated crash).
- A warning needs all three parts: context (which binary, which file), action taken (fallback, retry once, stopped), user step (set `forgels.serverPath`, reload, file issue with log).
- Never use warnings as control flow. Branch on typed values, not on whether a warn was shown.

## Good vs bad

Good (channel, silent default, typed fallback):

```ts
if (configured.trim().length === 0) {
  return "forgels";
}
```

Bad (warn noise, no action):

```ts
console.warn("no path, using default");
return "forgels";
```

Good (user message with action):

```ts
const pick = await vscode.window.showErrorMessage(
  "ForgeLS server binary not found. Set forgels.serverPath.",
  "Open Settings",
);
if (pick === "Open Settings") {
  await vscode.commands.executeCommand("workbench.action.openSettings", "forgels.serverPath");
}
```
