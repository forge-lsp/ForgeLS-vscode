# errors-async

Scope: error handling, `Promise`, and `async` or `await` in forgels-vscode.

## Rules

- Do not trust input. Validate `unknown` from settings, file paths, and server responses before use.
- No empty catch that only logs. Either handle (fallback, retry once, user action) or propagate with context. Document intentional ignore with a why comment.
- No try or catch around infallible code such as pure `parseConfig`. Keep config parsing total and sync.
- Prefer `Promise` plus `async` or `await` over callbacks. Do not wrap one item in `Promise.all([x])`. Await it directly.
- Every `async` function must contain `await`. Pure helpers stay sync. `activate`, `startClient`, `stopClient`, and `restartClient` are async because they await the client.
- Client start and stop are single flight: second `startClient` while started is a no-op return, second `stopClient` while stopped is a no-op return.
- Throw only `Error` objects, never strings or raw objects. Catch as `unknown`, then narrow before reading `message` or `code`.

## Good vs bad

Good (narrow caught error):

```ts
try {
  await next.start();
} catch (err: unknown) {
  client = undefined;
  const msg = err instanceof Error ? err.message : "unknown start error";
  output.appendLine(`ForgeLS start failed: ${msg}`);
  throw err instanceof Error ? err : new Error(msg);
}
```

Bad (empty catch plus log):

```ts
try {
  await next.start();
} catch (e) {
  console.warn(e);
}
```
