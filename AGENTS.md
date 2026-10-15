# forgels-vscode - Agent Rules

Scope: VSCode extension as LSP client for the forgels server binary. Beta language is solidity only.

Read this file before any code change. Keep all changes consistent with the architecture in `docs/architecture.md`.

## 1. Goal and Non Goal

- Goal: stable LSP client. Activation, server spawn, stdio transport, config, diagnostics display.
- Beta: solidity (`solidity`, `.sol`) only.
- Future: cairo, noir, move behind config flags. Lint and format as separate modules later.
- Non goal for now: no lint rules, no formatter, no grammar, no analysis. Server owns those.

## 2. Layout

```text
forgels-vscode/
  package.json            # extension manifest, scripts, vscode engine
  tsconfig.json           # strict safe typed, no allowJs
  src/
    extension.ts          # activate, deactivate only
    client.ts             # LanguageClient lifecycle
    config.ts             # typed settings read and resolve
    languages.ts          # language table, beta gate
    server.ts             # server binary resolve and spawn options
  docs/
    architecture.md       # source of truth for client design
  .opencode/agents/       # planner, executor, qa
```

## 3. Type Rules (Strict)

1. TypeScript only. No `.js` source files. Set `allowJs: false` and `checkJs: false`.
2. Enable `strict`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `exactOptionalPropertyTypes`.
3. Exported functions need explicit param and return types.
4. No `any`. Use `unknown` plus narrowing. No `as unknown as` chains.
5. Guard clause first. Narrow early, return early.
6. No non-null assertion `!` in client paths. Narrow with an early return instead.
7. No `console.*` in `src`. No warn without context plus user action. See `forgels-typescript/references/no-warn-no-console.md`.
8. Load skill `forgels-typescript` plus `forge-deslop` before any TS change. Read the matching `references/` file first.

## 4. Client Rules

1. Client stays thin. No parsing. No AST. No diagnostics logic. Render what the server sends.
2. Module split:
   - `extension.ts`: activate and deactivate only.
   - `client.ts`: create, start, stop, restart `LanguageClient`.
   - `config.ts`: read `forgels.*` settings with typed defaults.
   - `languages.ts`: map language id and extensions. Expose `isBetaEnabled`.
   - `server.ts`: resolve binary path and args. Support `forgels.serverPath` override.
3. Transport is stdio for now. Keep a single place to switch transport later.
4. Config keys live under `forgels.*`. Add defaults in `package.json` contributes.
5. Beta gate: solidity active by default. Cairo, noir, and move default off until the server reports support.

## 5. Language Table

- Beta active: `solidity` with `.sol`.
- Planned gated: `cairo` with `.cairo`, `noir` with `.nr`, `move` with `.move`.
- Document selector must derive from this table, not hardcoded strings per call site.

## 6. Workflow

Use Bun for install and test. Use TypeScript compiler for typecheck.

```bash
bun install
bunx tsc --noEmit
bun test
bun run lint
bun run format:check
bun run build
bun run package
```

Rules:

- Keep code in English. Comments short. Explain why, not what.
- Run `bunx tsc --noEmit` before commit. Keep Biome lint and format clean.
- One concern per change. Do not mix refactor with feature.
- No debug prints. No commented code. No vague TODO. Each TODO needs owner and scope.

## 7. Docs Rules (Strict)

- Language: always English.
- Style: direct and compact. Use bullets and code over prose.
- Forbidden: em dash. Never use it. Use hyphen `-` or colon `:`.
- Charset: plain ASCII only. No unicode symbols. Stick to basic punctuation, code ticks, and standard mermaid syntax.
- Each doc states scope at top.
- Update `docs/` in the same PR as behavior change.

## 8. OpenCode Setup

- `opencode.json`: instructions (`AGENTS.md`, `docs/architecture.md`), formatter on, skills allowed for all agents.
- Project MCP: `plane` at `https://mcp.plane.so/http/mcp` via OAuth. Auth once in browser, then use natural language prompts. Resolve project and state IDs via list calls. Do not guess UUIDs.
- Agents (`mode: subagent`):
  - `forgels-vscode-planner`: plan only, no edits.
  - `forgels-vscode-executor`: implements approved plan with small diffs.
  - `forgels-vscode-qa`: reviews diffs, runs typecheck and tests. Verdict PASS or FAIL.
- Skills (`.opencode/skills/`):
  - `forge-deslop`: slop hygiene, no warn noise, ASCII only.
  - `forgels-git`: Conventional Commits, one concern per commit.
  - `forgels-planner`: Plane-first with Indonesian 5W1H items.
  - `forgels-typescript`: strict typed TS with per case `references/`. Load before any TS change.
- QA loop: QA runs `tsc`, `lint`, `format:check`, `test`, `build`. On FAIL, executor runs `bun run format`, fixes listed issues, then requests QA again. Loop until PASS.

## 9. Agent Checklist Before Finish

1. `bunx tsc --noEmit` passes.
2. No `.js` source added. No `any` without guard.
3. Client stays thin. No server logic duplicated.
4. Solidity only in beta paths. Other languages gated.
5. `docs/` edits are English, direct, ASCII only, with no em dash.
6. `forgels-vscode-qa` verdict is PASS with evidence.
7. Plane work item updated with result and verification.
