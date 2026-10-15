# testing

Scope: `bun test` cases for forgels-vscode.

## Rules

- Testing is mandatory for every new pure behavior in `config.ts` and `languages.ts`. No test means FAIL in QA.
- Test one behavior per test. Name it as a sentence: `test("default toggle activates solidity only")`.
- Prefer pure functions under test. Never import `vscode` in a test file. Pass a `Map` or lambda as the settings reader.
- Keep tests small: arrange one store, act once, assert one idea with 1 to 3 `expect` calls.
- Do not test VSCode API wiring (`activate`, `startClient`) with `bun test`. Those paths are verified by `tsc` plus manual reload. Test the pure helpers they call.
- Run `bun test` after every logic change. Keep the count green before handoff.

## Good vs bad

Good (pure, one behavior):

```ts
test("all disabled yields empty selector", () => {
  const ids = getActiveLanguageIds({
    enableSolidity: false,
    enableCairo: false,
    enableNoir: false,
    enableMove: false,
  });
  expect(ids).toEqual([]);
});
```

Bad (imports vscode, tests nothing pure):

```ts
import * as vscode from "vscode";
test("activate works", () => {
  expect(true).toBe(true);
});
```
