---
name: forge-deslop
description: Writing hygiene for forgels-vscode. Blocks AI slop with objective reasons per pattern.
license: MIT
compatibility: opencode
metadata:
  audience: contributors
  workflow: review
  opencode/slash: "true"
  opencode/autoinvoke: "false"
---

# forge-deslop

Focus: clean writing in code, comments, docs, and notes. Avoid AI slop.

## When to use me

Use when writing or reviewing any text: TypeScript code, comments, official docs, agent rules, planning notes, commit messages. Load me together with `forgels-typescript` for code and `forgels-git` for commits.

## Source of truth

Read the slop reference bundled in this skill folder before review. It explains each slop pattern objectively: what it looks like, why it harms readability, and how to fix it.

Read `references/slop-patterns.md` and apply the TypeScript maps:

- `verbose-obvious-comment`: remove comments that state the obvious (`// Get the config`, `// Start the client`, `// Return the result`).
- `section-divider-comment`: remove `// --- Foo ---`, `// === Bar ===` decorations.
- `todo-placeholder`: flag vague `TODO: fix this` or `TODO: handle later`. Require owner and scope.
- `empty-catch-log`: flag catch that only logs. Handle or propagate with context.
- `console-log-debug`, `commented-console-log`, `function-entry-log`, `function-exit-log`: remove debug prints (`console.log`, `console.warn`, `console.debug`) and commented code. No entry or exit logs per function.
- `redundant-return`, `boolean-comparison`: simplify (drop trailing `return;`, use `if active` not `if active === true`).
- `verbose-temp-variable`: rename `temporaryVariableForX` style to short clear names.
- `async-no-await`, `await-promise-all-single`: flag async without await or single item batch wrappers.
- `warn-without-action`: flag `console.warn` or `window.showWarningMessage` with no handler, no issue link, and no user action. Warnings must carry context and a next step.

Also skip paths in `IGNORE_PATTERNS` (`dist`, `out`, `node_modules`, `.git`, `coverage`).

## Rules for forgels-vscode

- Writing must be to the point. One idea per line or bullet.
- Plain natural ASCII only. No unicode tricks. No em dash. Use hyphen `-` or colon `:`.
- Official docs: English, direct, bullets and code over prose.
- Keep `SUPPORTED_EXTENSIONS` in mind: apply checks to `.ts` plus `.md` and `json` when touched. Never add `.js` source files.
- No `console.warn` as control flow. No `console.log` in `src`. Use the output channel only through `client.ts`.

## Workflow

1. Read `references/slop-patterns.md` bundled in this skill folder.
2. Scan changed files for the pattern ids there. Quote the matched line.
3. Fix by remove, simplify, or flag with context:
  - Remove: obvious comments, dividers, debug logs, commented code, stray warnings.
  - Simplify: bool compare, redundant return, verbose temp names.
  - Flag: vague TODO, empty catch, async without await, warn without action. Ask for context.
4. Verify docs still ASCII only and with no em dash char at all.

## Examples

Remove:

```ts
// Get the config value
const cfg = parseConfig(get);
console.log("DEBUG: entering start");
if (active === true) {
  return;
}
```

Keep:

```ts
// Empty server path means auto resolve, keep default silent.
if (raw.trim().length === 0) {
  return "forgels";
}
```
