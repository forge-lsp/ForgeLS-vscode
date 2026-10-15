# strict-config

Scope: `tsconfig.json`, `tsconfig.build.json`, module setup for forgels-vscode.

## Required flags

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true,
  "exactOptionalPropertyTypes": true,
  "allowJs": false,
  "checkJs": false
}
```

## Rules

- Keep `allowJs: false` and `checkJs: false`. Never add `.js` source. Build output goes to `dist` only.
- Keep `strict: true`. Do not disable `strictNullChecks` or `noImplicitAny` to silence an error. Fix the type instead.
- Keep `noUncheckedIndexedAccess: true`. Index access yields `T | undefined`. Narrow before use.
- Keep `noFallthroughCasesInSwitch: true`. Every `case` ends with `return`, `break`, or `throw`, or add an explicit fallthrough comment that Biome accepts.
- Keep `exactOptionalPropertyTypes: true`. Do not assign `undefined` to an optional prop unless the type allows it. Use a default object plus spread.
- Keep `isolatedModules: true`. Use `import type` for type only imports so single file transpilation stays safe.
- `src/**/*.test.ts` is typechecked by `tsconfig.json` but excluded from `tsconfig.build.json`. Tests never ship in `dist`.

## Good vs bad

Good (narrow index access):

```ts
const entry = table[i];
if (entry === undefined) {
  return false;
}
return entry.betaActive;
```

Bad (assumes index exists):

```ts
return table[i].betaActive;
```
