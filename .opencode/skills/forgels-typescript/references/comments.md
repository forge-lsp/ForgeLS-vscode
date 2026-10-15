# comments

Scope: `//` notes and `TODO` items in forgels-vscode.

## Rules

- Comment as much as needed but not more. Explain why, not what. If the code states it, delete the comment.
- One line for brief notes. Multi line only for module contracts or tricky fallbacks.
- No obvious comments: `// Get the config`, `// Start the client`, `// Return the result`.
- No divider decorations: `// --- Foo ---`, `// === Bar ===`. Split by function or module instead.
- No commented code. Delete it. History stores it.
- Each `TODO` needs owner and scope: `// TODO(owner: client): retry start once on ECONNREFUSED, then show action`. Vague `TODO: fix this` is a FAIL.
- Docs stay direct with bullets and code. ASCII only. No em dash.

## Good vs bad

Good (why, with contract):

```ts
// Empty server path means auto resolve, keep default silent.
if (raw.trim().length === 0) {
  return "forgels";
}
```

Bad (restates code):

```ts
// Check if raw is empty
if (raw.trim().length === 0) {
  return "forgels";
}
```
