# functions

Scope: function shape, params, branches, and switches in forgels-vscode.

## Rules

- One function does one thing. If it has more than 10 lines, ask if a helper is missing. Best size is 5 to 10 lines.
- Max 3 params. More than that means an options object such as `LanguageToggle` or `ForgelsConfig`.
- No boolean flag params that fork behavior inside. Split into two functions such as `startClient` and `restartClient`.
- Guard clause first. Narrow early, return early. Flat over nested. No `if` inside `if` inside `if` for happy paths.
- Use `===` and `!==` only. Never `==` or `!=`.
- End every `switch` with a `default` or an exhaustive `never` check. Missing language ids must fail typecheck, not fall through silently.
- Prefer array methods (`map`, `find`, `filter`) over manual index loops for selector and table code. Use `for...of` only when early exit or side effects are clearer.
- Prefer pure functions in `config.ts` and `languages.ts`. Side effects live in `extension.ts` and `client.ts` only.

## Good vs bad

Good (guard first, exhaustive switch):

```ts
export function isLanguageActive(id: LanguageId, toggle: LanguageToggle): boolean {
  switch (id) {
    case "solidity":
      return toggle.enableSolidity && isBetaEnabled(id);
    case "cairo":
      return toggle.enableCairo;
    case "noir":
      return toggle.enableNoir;
    case "move":
      return toggle.enableMove;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
```

Bad (flag param, nested, bool compare):

```ts
export function setup(cfg: unknown, fast: boolean): void {
  if (cfg) {
    if (fast === true) {
      start();
    }
  }
}
```
