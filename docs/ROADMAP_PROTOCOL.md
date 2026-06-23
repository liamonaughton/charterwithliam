# ROADMAP_PROTOCOL — how NOTES.md is structured

Defines the **5-field convention** every item in `NOTES.md` follows, so `/start`
can mechanically surface blockers and priorities.

## The 5 fields

Each item is a row with exactly these fields:

| Field | Values | Meaning |
|-------|--------|---------|
| **ID** | `N1`, `N2`, … | Stable handle for cross-referencing (CHAT_HANDOFF, SESSION_LOG, DECISIONS). |
| **Status** | 🔴 blocker · 🟡 active · 🔵 backlog · 🟢 done | Lifecycle state. 🔴 and 🟡 surface in the `/start` briefing; 🔵 does not; 🟢 gets swept into SESSION_LOG on the weekly review. |
| **Priority** | P0 · P1 · P2 | P0 = stop-the-line / ship-blocker. P1 = this phase. P2 = nice-to-have / v2. |
| **Area** | `email`, `db`, `infra`, `frontend`, `compliance`, `process` | Subsystem, for grouping. |
| **Note** | free text | The actual item + any pointer to a file/line or decision. |

## Rules

- **Blockers** = any item with Status 🔴 **or** Priority P0. These are what
  `/start` lists under "Blockers".
- An item is only `🟢 done` once verified (not just code-committed) — e.g. an
  email fix isn't done until a real send is confirmed delivered.
- When an item is resolved, set 🟢 and leave it until the weekly review moves it
  to `docs/SESSION_LOG.md`; don't delete history silently.
- New long-tail/v2 ideas go in as 🔵 P2 so they don't clutter the briefing.
