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
docs/
  architecture.md
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

## Config

- `forgels.serverPath`: path override. Empty means auto resolve.
- `forgels.trace`: `off`, `messages`, `verbose`.
- `forgels.enableSolidity`: default true.
- `forgels.enableCairo`, `forgels.enableNoir`, `forgels.enableMove`: default false.

## Rules

- TypeScript only. No `.js` source. Strict safe typed.
- Client stays thin. Server owns grammar and analysis.
- English docs. ASCII only. No em dash.
