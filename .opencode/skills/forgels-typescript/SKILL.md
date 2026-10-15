---
name: forgels-typescript
description: Strict safe typed TypeScript for forgels-vscode with per case references. No any, no warn noise, Biome clean.
license: MIT
compatibility: opencode
metadata:
  audience: contributors
  workflow: typescript
  opencode/slash: "true"
  opencode/autoinvoke: "false"
---

# forgels-typescript

Focus: readable, strict, and consistent TypeScript for the VSCode LSP client. All code and comments are objective English, to the point.

## When to use me

Use when writing, editing, or reviewing TypeScript in `src/*`. Load me before any TS change. `forgels-vscode-qa` uses me to review. Read the matching file under `references/` before touching that area. Do not guess when a reference exists.

## Core rules (MANDATORY)

- TypeScript only. No `.js` source files. `allowJs` is `false`.
- Strict mode is on. Required flags: `strict`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `exactOptionalPropertyTypes`.
- No `any`. Use `unknown` plus narrowing. Explicit param and return types on every exported function. No `as unknown as` chains.
- No `console.log`, no `console.warn`, no `console.debug` in `src`. No `showWarningMessage` without context plus user action. Use the output channel in `client.ts` or return a typed error.
- Guard clause first. Happy path last. Flat over nested. Max 3 params per function, else pass an options object. No boolean flag params that fork behavior.
- Names carry meaning: role nouns for variables, verb plus object for functions. Bool names use `is` or `has` or `enable` prefix. No `data`, `thing`, `tmp`, `x1`.
- English only in code, comments, and docs. ASCII only. No emoji. No em dash. Use hyphen `-` or colon `:`.
- Biome format and lint must pass. Run `bun run format` then `bun run lint` before finish.

## Edit tooling (STRICTLY FORBIDDEN otherwise)

- Edit files ONLY with the dedicated file tools (`edit`, `write`).
- STRICTLY FORBIDDEN: editing file content through any program or workaround, including `python3 -c`, `python` scripts, `sed`, `awk`, `perl`, `echo` redirection, or heredocs.
- Shell (`bash`) is for read-only inspection and project commands only: `bun`, `git`, `ls`, `bunx tsc`. Never for writing file content.
- Reason: programmatic edits corrupt text silently (escaping, unicode, off-by-one ranges) and bypass tool safety checks.

## References (read before you change that area)

| File | Use when |
| ---- | -------- |
| `references/strict-config.md` | Touching `tsconfig.json`, build, or module setup |
| `references/no-any-unknown.md` | Typing values, parsing config, handling `unknown` |
| `references/no-warn-no-console.md` | Logging, warnings, user messages, output channel |
| `references/naming.md` | Naming vars, functions, types, config keys |
| `references/functions.md` | Splitting helpers, params, guard clauses, switches |
| `references/comments.md` | Writing `//` notes, `TODO` with owner and scope |
| `references/imports.md` | Adding imports, ordering, removing unused |
| `references/errors-async.md` | `try` or `catch`, `Promise`, `async` or `await` |
| `references/testing.md` | Adding `bun test` cases for `src` |
| `references/biome.md` | Running format and lint, fixing Biome reports |
| `references/vscode-mapping.md` | Wiring `extension`, `client`, `config`, `languages`, `server` |

## forgels-vscode musts

- Client stays thin. No grammar. No analysis. No diagnostics transform.
- `extension.ts` only activates and deactivates. `client.ts` owns the `LanguageClient` lifecycle. `config.ts` and `languages.ts` stay pure with no `vscode` runtime import.
- Document selector derives from `languages.ts` plus enable flags. Never hardcode `solidity` per call site.
- Solidity is the only beta active language. Cairo, noir, and move stay gated behind config flags.
- New shared client logic goes to the matching module, not inline in `activate`.

## Good vs bad (types and flow)

Good (strict, narrow early, pure where possible):

```ts
export function parseConfig(get: (key: string) => unknown): ForgelsConfig {
  const raw = get("serverPath");
  if (typeof raw !== "string") {
    return getDefaultConfig();
  }
  return { ...getDefaultConfig(), serverPath: raw.trim() };
}
```

Bad (any, warn noise, nested, flag param):

```ts
export function setup(cfg: any, fast: boolean): void {
  console.warn("setup called");
  if (cfg) {
    if (fast === true) {
      console.log(cfg);
    }
  }
}
```

## Checklist

1. Relevant `references/` file read and applied.
2. Guard clause first. No `any`, no `==`, no `=== true`, no dead code.
3. Names state roles and actions. Comments are short ASCII why-notes.
4. No `console.*` in `src`. No warn without context plus action.
5. Edited only with file tools. No programmatic edit of any kind.
6. `bunx tsc --noEmit` passes. `bun run lint` and `bun run format:check` pass. `bun test` passes when logic changed.

## Sources

- TypeScript Best Practices, andredesousa: https://github.com/andredesousa/typescript-best-practices
- Clean Code TypeScript, labs42io: https://github.com/labs42io/clean-code-typescript
- TypeScript Handbook, Do and Do not: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
