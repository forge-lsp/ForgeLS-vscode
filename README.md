# forgels-vscode

Scope: VSCode LSP client for the forgels server binary. Beta supports solidity only.

## Status

- LSP client scaffold done. Solidity beta active.
- Cairo, noir, and move are gated off.
- Lint and format are planned as separate modules.

## Layout

```text
src/
  extension.ts   # activate, deactivate
  client.ts      # LanguageClient lifecycle
  config.ts      # forgels.* settings
  languages.ts   # language table and beta gate
  server.ts      # binary resolve
  server-resolve.ts # pure resolve logic, unit tested
  test/suite/   # integration suite, runs in host
docs/
  architecture.md
test-fixtures/
  basic/        # hello.sol fixture workspace
.opencode/agents/
  forgels-vscode-planner.md
  forgels-vscode-executor.md
  forgels-vscode-qa.md
```

## Setup

```bash
bun install
bunx tsc --noEmit
bun test
bun run build
```

## Testing

- Unit: `bun test` runs `src/*.test.ts` only. Integration files live
  in `src/test` and use the `.suite.ts` suffix so bun skips them.
  Add new unit tests as `src/<name>.test.ts` and list them in the
  `test` script.
- Integration: `bun run test:integration` compiles `src/test` to
  `dist/test` then runs `vscode-test` in the Extension Host. Needs
  internet once to download VS Code and a display to launch it.

## Config

- `forgels.serverPath`: path override. Empty means auto resolve.
- `forgels.serverVersion`: release to download when missing. Default `v0.1.0-pre2`.
- `forgels.autoDownload`: download the binary when missing. Default true.
- `forgels.trace`: `off`, `messages`, `verbose`.
- `forgels.enableSolidity`: default true.
- `forgels.enableCairo`, `forgels.enableNoir`, `forgels.enableMove`: default false.

## Rules

- TypeScript only. No `.js` source. Strict safe typed.
- Client stays thin. Server owns grammar and analysis.
- English docs. ASCII only. No em dash.
