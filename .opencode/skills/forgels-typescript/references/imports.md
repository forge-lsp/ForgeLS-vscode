# imports

Scope: import order, used names, and file types in forgels-vscode.

## Rules

- Organize imports: stdlib (`path`), then `vscode`, then `vscode-languageclient`, then local `./config`, `./languages`, `./server`. One blank line between groups is fine.
- Remove unused imports before finish. Biome and `tsc` both flag them. Do not leave commented imports.
- Use `import type` for type only names such as `ForgelsConfig`, `LanguageClientOptions`, `ServerOptions`. This keeps `isolatedModules` safe.
- `import * as vscode` is allowed only in `extension.ts`, `client.ts`, and `server.ts` where the API is used broadly. Pure modules (`config.ts`, `languages.ts`) must not import `vscode` at runtime. Tests must not import `vscode` at all.
- Relative imports use extensionless paths such as `./config` under `module: CommonJS`. Do not add `.js` suffixes here.
- Never add `.js` source files. Never import from `dist` or `out`.

## Good vs bad

Good (type import, grouped):

```ts
import * as vscode from "vscode";
import { restartClient, startClient, stopClient } from "./client";
import { type ForgelsConfig, parseConfig } from "./config";
```

Bad (unused, runtime type import):

```ts
import * as vscode from "vscode";
import { ForgelsConfig } from "./config";
```
