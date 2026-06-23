# CHAT_HANDOFF — where we are right now

> Canonical "current state" doc. Update at the end of every session. `/start`
> reads this + the last SESSION_LOG entry to brief the next session.

_Last updated: 2026-06-22_

## Where we are right now

The **CharterWithLiam lead-capture landing page is live in production** (Vercel,
aliased to `www.charterwithliam.com`). **`main` is now the production source of
truth** — the long-lived `claude/magical-fermat-0k2i0z` feature branch has been
merged in, GitHub's default branch is repointed to `main`, and deploys go from
`main` (the manual `--force`-promote-a-feature-branch workflow is retired).

Shipped & verified this session:

1. **Guide-email feature shipped.** The welcome email now links a
   **Supabase-hosted public `charter-guide.pdf`** (bucket `guides`) via a CTA
   button + fallback link, with **Resend native open/click tracking** (plain
   `<Button>`/`<Link>`, no custom redirect/table/migration). Single combined
   send. (commit `a7acce7`)
2. **Merge to `main`.** `claude/magical-fermat-0k2i0z` → `main` via `--no-ff`
   merge `35217c3` (welcome email, Turnstile work, migration `0002`, session
   docs). GitHub default branch repointed `feature → main`.
3. **Turnstile re-entrancy fix — live & verified.** Root cause: a widget
   rendered with the default `execution:'render'` auto-starts its challenge, so
   the extra `execute()` call hit an already-executing widget ("already
   executing" flood, no token). Fix: `execution:'execute'` + an `executedRef`
   guard so `execute()` fires once per widget. PR #1
   (`fix/turnstile-execute-reentrancy`, `c6845c3`) → `--no-ff` merge `4966b13` →
   deployed. **Verified:** fresh-email submit is clean, console quiet.

## Immediate next priorities (🔴 = top of tomorrow's list)

1. **🔴 Original test email won't re-trigger the welcome email. UNRESOLVED.**
   Confirmed so far: the prod `leads` row was deleted (`SELECT` returns 0), fresh
   emails work fine, and Resend suppression was checked — **nothing found**. So
   **scenario A (wrong DB deleted) is RULED OUT**, and **scenario B (silent
   Resend reject) is NOT confirmed**. **Next step:** resubmit the original
   address and watch **Resend → Emails live** to see whether a send is even
   **attempted**. *No attempt logged* ⇒ look **upstream** (caching / gate logic /
   propagation), **not** Resend. The welcome gate is `if (!existing?.welcome_sent_at)`
   on the pre-upsert `SELECT` snapshot (`app/actions/subscribe.ts:145`).
2. **Surface the swallowed welcome-send failure.** Add `console.error` on
   `!sent.ok` for the welcome send (1–3 lines, **off `main`, its own PR**). The
   send block currently has no `else`/log (`subscribe.ts:145–156`) — that silence
   is exactly why (1) is hard to diagnose.
3. **Set `RESEND_FROM` for Vercel Preview** = `Liam <liam@charterwithliam.com>`
   (currently unset → falls back to `onboarding@resend.dev`). Dashboard fix.
4. **Decide `claude/friendly-keller-n3pn55`'s fate.** Competing **static-PDF**
   guide-delivery (`public/charter-buyers-guide.pdf` + `scripts/generate-guide.ts`)
   that will **conflict in `subscribe.ts`/`resend.ts`** if merged. Abandon or
   reconcile deliberately. Possibly **salvage its silent-failure logging
   pattern** (commit `e5c58ce`) — but as a fresh small edit, not a cherry-pick
   (the file diverged + it reintroduces the static guide URL).

## Not now (deferred)

- **Option 2 — dedicated sending subdomain** (`send.charterwithliam.com` verified
  in Resend) for reputation isolation. Revisit at marketing volume. See
  `docs/DECISIONS.md` D2.
