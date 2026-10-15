# naming

Scope: variables, functions, types, and config keys in forgels-vscode.

## Rules

- Call things by their name. A reader must tell what it is and what it does without opening the body.
- Variables are role nouns: `cfg`, `cmd`, `ids`, `selector`, `output`. No `data`, `thing`, `tmp`, `x1`, `value2`.
- Functions are verb plus object: `parseConfig`, `resolveServerCommand`, `startClient`, `getActiveLanguageIds`.
- Booleans use `is`, `has`, or `enable` prefix: `isStarted`, `isBetaEnabled`, `enableSolidity`.
- Types use nouns: `ForgelsConfig`, `LanguageEntry`, `ServerResolution`. Do not marry values into names: use `isLegalAge`, not `isOverEighteen` style names tied to a magic value.
- Config keys live under `forgels.*` and match the `ForgelsConfig` fields exactly: `serverPath`, `trace`, `enableSolidity`, `enableCairo`, `enableNoir`, `enableMove`.

## Good vs bad

Good:

```ts
export function isLanguageActive(id: LanguageId, toggle: LanguageToggle): boolean
```

Bad:

```ts
export function check(x: unknown): boolean
```
