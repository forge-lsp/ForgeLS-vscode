# no-any-unknown

Scope: typing values, parsing VSCode settings, handling external input in forgels-vscode.

## Rules

- Never use `any`. Use `unknown` for external input such as `workspace.getConfiguration().get(key)`.
- Narrow with `typeof`, `in`, array `includes`, or a type predicate such as `isTraceLevel`. Return early on mismatch with a typed default.
- Every exported function declares explicit param types and an explicit return type.
- Prefer string unions over plain `string` when the value set is closed, for example `TraceLevel = "off" | "messages" | "verbose"`.
- Prefer `readonly` on config objects and arrays that callers must not mutate.
- No `as unknown as` chains. One narrow cast at a boundary is the max, and it needs a comment that states why the shape is trusted.

## Good vs bad

Good (unknown plus narrowing):

```ts
function isTraceLevel(value: unknown): value is TraceLevel {
  return value === "off" || value === "messages" || value === "verbose";
}

export function parseTrace(raw: unknown): TraceLevel {
  if (isTraceLevel(raw)) {
    return raw;
  }
  return "off";
}
```

Bad (any plus silent trust):

```ts
export function parseTrace(raw: any): any {
  return raw;
}
```
