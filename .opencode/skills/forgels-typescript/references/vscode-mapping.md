# vscode-mapping

Scope: module split and server contract for forgels-vscode.

## Rules

- `extension.ts`: activate and deactivate only. Reads config once, starts client, registers one `onDidChangeConfiguration` watcher that restarts on `forgels.*` change. No client logic.
- `client.ts`: owns the `LanguageClient` lifecycle (`startClient`, `stopClient`, `restartClient`, `isStarted`). Single place to change transport later. Holds at most one client instance.
- `config.ts`: pure. `getDefaultConfig` plus `parseConfig(get)`. No `vscode` runtime import. `extension.ts` passes a getter that reads `workspace.getConfiguration("forgels")`.
- `languages.ts`: pure. Single language table with `id`, `extensions`, `betaActive`. Exposes `isBetaEnabled`, `isLanguageActive`, `getActiveLanguageIds`. Selector derives from this table, never hardcoded per call site.
- `server.ts`: resolves the binary command. Order: `forgels.serverPath` setting, then bundled `bin/forgels`, then `PATH` name `forgels`. Args default to empty for stdio. No spawn outside `ServerOptions`.
- Transport is stdio only. Config keys live under `forgels.*` with defaults in `package.json` contributes.
- Beta gate: solidity active by default. Cairo, noir, and move default false until the server reports support. New language means one table row plus one config flag plus docs update.

## Language table

```text
solidity: .sol, beta active
cairo:    .cairo, gated off
noir:     .nr, gated off
move:     .move, gated off
```
