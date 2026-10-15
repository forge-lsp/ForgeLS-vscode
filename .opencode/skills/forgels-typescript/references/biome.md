# biome

Scope: format and lint gate for forgels-vscode. Biome is the only formatter and linter.

## Commands

```bash
bun run format        # write safe fixes plus format in place
bun run format:check  # fail on drift, used by QA
bun run lint          # fail on lint errors, used by QA
bun run check         # full gate: tsc plus biome plus tests
```

## Rules

- Run `bun run format` after every edit that touches `src`, docs code blocks excluded. Then run `bun run lint` and `bun run format:check`.
- Zero warnings policy. A Biome warning is a FAIL. Fix it or add a narrow `biome-ignore` with a why comment plus owner. Broad ignores are FORBIDDEN.
- FORBIDDEN suppressions without reason: bare `biome-ignore`, `eslint-disable`, `@ts-ignore`, `@ts-expect-error` with no comment. Each suppression needs a one line why plus scope.
- Keep `biome.json` strict: `noAny`, `noConsole`, `noNonNullAssertion` in client paths, `useConst`, `useImportType`, no unused imports or vars.
- QA must run the gate in order and attach output: `bunx tsc --noEmit`, `bun run lint`, `bun run format:check`, `bun test`, `bun run build`. Any red step sends the task back to `forgels-vscode-executor` with a minimal fix list. QA never fixes code itself.

## Good vs bad

Good (narrow suppress with reason):

```ts
// biome-ignore lint/style/noNonNullAssertion: guarded by early return above, same block.
// biome-ignore-format: keep table rows aligned for review.
```

Bad (broad silent suppress):

```ts
// biome-ignore: fix later
// @ts-ignore
```
