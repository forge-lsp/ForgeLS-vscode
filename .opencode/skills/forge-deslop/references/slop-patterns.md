# Slop Patterns Reference

Scope: `forge-deslop` skill. Objective reference for AI slop detection in forgels-vscode.

Each entry states what it looks like, why it is forbidden, and how to fix it. Objective reason: less noise means faster review and fewer hidden bugs. Subjective reason: human code is direct and confident, it does not narrate itself or hedge with filler.

Use this file in review workflow: match `id` against changed lines, then apply `Fix` (remove, simplify, or flag).

## How to use

1. Scan changed files for each `id` below.
2. Quote the matched line in review output.
3. Apply fix: `remove-line`, `simplify`, or `flag` for human context.
4. Skip paths in `IGNORE_PATTERNS`.

## 1. Excessive comments

### verbose-obvious-comment (low, remove-line)

- What: comment that restates the code, for example `// Get the config`, `// Start the client`, `// Return the result`.
- Why forbidden: it adds noise, hides real logic, and drifts from code on refactor. Readers can see the call already.
- TS map: same rule for `//` in `src/*.ts`. Keep only why or contract, for example `// Empty path means auto resolve, keep silent.`
- Fix: delete the line. Keep code self evident.

### section-divider-comment (low, remove-line)

- What: decoration dividers such as `// --- Client ---`, `// === Foo ===`.
- Why forbidden: it fakes structure, breaks `grep`, and creates merge noise. Use modules, functions, or headers in markdown instead.
- TS map: same. Split code by function or module.
- Fix: delete the line.

### todo-placeholder (medium, flag)

- What: vague task such as `// TODO: fix this`, `// TODO: handle later`.
- Why forbidden: it is not actionable, has no owner or scope, and rots in tree. It hides missing work from planner and QA.
- TS map: same. Require owner and scope, for example `// TODO(owner: client): retry start once on ECONNREFUSED`.
- Fix: flag. Ask for clear task or delete if not needed.

## 2. Defensive programming overkill

### triple-null-check (medium, flag)

- What: triple guard such as `x != null && x !== undefined && x !== ""`.
- Why forbidden: it shows unclear null contract and duplicates checks. It makes happy path hard to read.
- TS map: prefer one clear contract. Use `unknown` plus narrowing once, or a small helper such as `isNonEmptyString`. Guard clause first.
- Fix: flag. Define one contract and use a guard clause.

### empty-catch-log (medium, flag)

- What: catch block that only logs, for example `catch (e) { console.error(e); }`.
- Why forbidden: it swallows the error, caller thinks it succeeded, and logs pile up without action.
- TS map: same in client lifecycle. Propagate, show a user action, or document why ignore with `void` plus comment.
- Fix: flag. Propagate with context, handle the case, or document intentional ignore.

### unnecessary-try-catch (low, flag)

- What: try or catch around code that cannot throw, such as a plain assignment.
- Why forbidden: it suggests failure where none exists and adds nesting for no gain.
- TS map: same. Do not wrap pure config parsing in try or catch.
- Fix: flag. Remove the wrapper.

## 3. Verbose naming

### verbose-temp-variable (low, flag)

- What: filler temp names such as `temporaryVariableForX`, `valueToBeReturned`, `dataToProcess`.
- Why forbidden: long names add no meaning and force readers to track aliases. They often hide that a helper function is missing.
- TS map: `let temporaryConfigValue`, `let resultOfResolve`. Prefer short clear names: `cfg`, `cmd`, `ids`.
- Fix: rename. Extract helper if temp lives too long.

### response-data-chain (low, flag)

- What: deep chain such as `response.data.data.value`.
- Why forbidden: it leaks nested shape into many call sites. A shape change breaks all of them.
- TS map: `section.get("x").value.data` repeated, or `context.subscriptions[0].foo.bar` chains.
- Fix: flag. Add accessor or destructure once at boundary.

## 4. Redundant code

### console-log-debug (high, remove-line)

- What: left over debug logs such as `console.log("DEBUG:...")`, `console.warn("TEMP:...")`.
- Why forbidden: it pollutes output, may leak data, and signals unfinished work.
- TS map: any `console.*` in `src/*.ts` except through the output channel in `client.ts`.
- Fix: delete the line before QA.

### commented-console-log (low, remove-line)

- What: commented debug such as `// console.log(x)`.
- Why forbidden: dead code in comments rots fast and confuses readers. History already stores it.
- TS map: `// console.warn(...)`.
- Fix: delete the line.

### warn-without-action (medium, flag)

- What: warning with no handler, for example `console.warn("failed")` or `showWarningMessage("failed")` with no next step.
- Why forbidden: it trains users to ignore warnings. A warning without context, owner, or action is noise.
- TS map: every user visible warning must state what happened, what the client did (retry, fallback, stop), and what the user can do (set `forgels.serverPath`, reload, file issue).
- Fix: flag. Add context plus action, or demote to output channel log, or remove.

### redundant-return (low, simplify)

- What: explicit empty return at end such as `return; }`.
- Why forbidden: it is noise. The function already returns empty by falling off the end.
- TS map: trailing `return;` where falling off is idiomatic.
- Fix: simplify to expression form.

## 5. Over logging

### function-entry-log (medium, flag)

- What: log at start of every function such as `console.log("Entering start")`.
- Why forbidden: it floods logs, adds no signal, and duplicates what the output channel already gives.
- TS map: same. Use the LSP trace channel only where needed.
- Fix: remove. Keep logs at client start, stop, and restart only.

### function-exit-log (medium, remove-line)

- What: log at end such as `console.log("Exiting...")`, `console.log("Done")`.
- Why forbidden: same as entry log. Exit is visible from return value or caller.
- TS map: same.
- Fix: delete the line.

## 6. Verbose coercion and compare

### boolean-comparison (low, simplify)

- What: explicit bool compare such as `if (ok === true)`, `if (x == false)`.
- Why forbidden: redundant and error prone (`=` vs `==`). Bool already is a condition.
- TS map: `if (active === true)`, `if (enabled == false)`.
- Fix: simplify to `if (active)`, `if (!enabled)`.

### string-coercion-verbose (low, flag)

- What: manual coerce such as `String(a) + String(b)` where template form is clearer.
- Why forbidden: verbose and easy to get wrong for edge types.
- TS map: prefer template literals or `path.join` for paths.
- Fix: flag. Use template or join once.

## 7. Imports

### wildcard-import-inline (low, flag)

- What: star import plus heavy dotted use without clear boundary.
- Why forbidden: it hides what is used, hurts search, and risks name clash.
- TS map: `import * as vscode` is allowed only in `extension.ts`, `client.ts`, and `server.ts` where the API is used broadly. In pure modules (`config.ts`, `languages.ts`) use explicit value imports or no import at all.
- Fix: flag. Import only used names explicitly in pure modules.

## 8. Async

### await-promise-all-single (low, simplify)

- What: batch wrapper for one item such as `await Promise.all([x])`.
- Why forbidden: extra wrapper with no concurrency gain. It misleads readers to expect many tasks.
- TS map: same in client start and stop paths.
- Fix: simplify to direct `await`.

### async-no-await (medium, flag)

- What: async function with no await inside. Needs validation before flag.
- Why forbidden: false async contract. Callers pay async cost and expect yield where none happens.
- TS map: `activate` and `startClient` are async because they await client start. Pure parsers must stay sync.
- Fix: flag. Make it sync or add missing await.

## Supported extensions

Apply checks to:

```text
.ts,
.md,
json
```

Priority is `src/*.ts` plus `docs/*.md`. Never introduce `.js` source files. Build output in `dist` and `out` is ignored.

## Ignore patterns

Skip these paths:

```text
node_modules, .git, dist, out, coverage,
bin, vendor
```
