---
name: forgels-planner
description: Plane-first planner for forgels-vscode. Mandatory Plane check before and after execution, with 5W1H Indonesian work items.
license: MIT
compatibility: opencode
metadata:
  audience: contributors
  workflow: plan
  opencode/slash: "true"
  opencode/autoinvoke: "false"
---

# forgels-planner

Focus: every forgels-vscode task is bound to a Plane work item. No execution without a clear status.

Note on language: this skill file is English. Work items written to Plane MUST be Indonesian.

## When to use me

Use me for every multi step task in `src/*`, docs, or packaging. Load me together with `forgels-typescript` and `forge-deslop` before planning or executing.

## Hard rules (MANDATORY)

1. MUST use Plane BEFORE and AFTER execution.
2. BEFORE execution: check for a relevant work item. If none exists, create one first. Then MUST update its status to In Progress before touching code.
3. AFTER execution: MUST move its status (Done when acceptance is met, Cancelled with a reason when dropped).
4. Every new finding (bug, gap, follow-up) MUST become a new work item. Never leave it only in chat or code comments.
5. Every work item MUST have an objective, to the point title and description.
6. Descriptions in Plane MUST be Indonesian with 5W + 1H points.
7. Status update is MANDATORY both BEFORE and AFTER. No silent exceptions.

## Project and states

- Default project: forgels-vscode. Resolve the project ID via `plane_project list` or equivalent. Do not guess UUIDs.
- If a shared ForgeLS project is used, resolve its ID the same way and note it in the work item.
- Never guess state UUIDs. Resolve states via list call for the target project, then map Backlog, Todo, In Progress, Done, Cancelled.
- When in doubt, re-read states via list call with the resolved `project_id`.

## Work item format (Indonesian content required)

Title:

- Pattern: `[area] short name`
- Valid areas: `client`, `config`, `languages`, `server`, `docs`, `tests`, `release`, `epic`.
- Short name: lowercase, max 60 chars, no emoji, no em dash.

Description:

- MUST be Indonesian.
- Objective and to the point. One idea per line or bullet.
- MUST contain 5W + 1H (write the labels in Indonesian):
  - Apa (What): what is done.
  - Kenapa (Why): objective reason, one sentence.
  - Di mana (Where): target module and files, for example `src/client.ts`.
  - Kapan (When): sprint or cycle, for example `Sprint 1` or `Sprint 2`.
  - Siapa (Who): executor role, for example `executor` or `qa`.
  - Bagaimana (How): measurable acceptance, for example `bunx tsc --noEmit passes and solidity diagnostics render`.
- Store as simple HTML with one `p` tag per point so it renders in Plane. Example `description_html` (keep this example in Indonesian):

```html
<div><p>Apa: tambah restart client saat config forgels berubah.</p><p>Kenapa: client harus memakai path server terbaru.</p><p>Di mana: src/client.ts dan src/extension.ts.</p><p>Kapan: Sprint 1.</p><p>Siapa: executor.</p><p>Bagaimana: ubah forgels.serverPath memicu satu kali restart dan diagnostics tetap tampil.</p></div>
```

## Workflow BEFORE execution

1. Find relevant candidates:
  - Search work items with area and topic keywords, then list with the resolved `project_id` to confirm.
  - Read the top 1-3 candidates. Match Apa, Di mana, and Bagaimana against the current task.
2. If a relevant item exists:
  - Reuse it. Do not duplicate.
  - Update its status to In Progress. This satisfies the BEFORE status update duty.
3. If none exists:
  - Create one with the resolved `project_id`, a `name` matching `[area] ...`, an Indonesian 5W + 1H `description_html`, and an honest `priority` (`high` only when it blocks beta).
  - Then update its status to In Progress. Do not start code before this status is recorded.
4. Write a short plan: 1-2 line goal, numbered steps per module, files to touch, verification.

## Workflow AFTER execution

1. Verify first: `bunx tsc --noEmit`, `bun test`, `bun run lint`, `bun run format:check`, `bun run build`.
2. Move status:
  - Done when every Bagaimana point is met.
  - Cancelled when dropped, with the reason in a comment.
  - Keep In Progress only for continued work, and comment what is missing.
3. Add a comment with: result, changed files, verification commands and results. The comment body may be English; the work item title and description stay Indonesian.
4. Scan for new findings. Each finding MUST become a new work item in Indonesian 5W + 1H format. Examples: server binary not found, wrong selector, stale docs, red build.

## Good vs bad

Good (Indonesian title + full 5W1H):

```text
[client] restart saat config berubah
Apa: restart client sekali saat forgels.serverPath berubah.
Kenapa: client harus memakai binary terbaru tanpa reload window.
Di mana: src/client.ts dan src/extension.ts.
Kapan: Sprint 1.
Siapa: executor.
Bagaimana: ubah setting memicu satu restart dan output channel tetap satu.
```

Bad:

- `fix bug client` (no area, no Di mana, no measurable Bagaimana).
- `Update docs` (no Kenapa, no acceptance).
- Long English prose with no clear points (violates the Indonesian description rule).

## Checklist before finish

1. A relevant work item exists and is In Progress BEFORE code changes.
2. Title matches `[area] ...`, description is Indonesian 5W + 1H.
3. Each new finding has its own work item.
4. AFTER status moved to Done or Cancelled, plus a result and verification comment.
5. No em dash in Plane text. Use hyphen `-` or colon `:`.
