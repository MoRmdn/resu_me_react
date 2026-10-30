# Instructions for coding agents

This file is for every agent working in this repository, whichever tool runs it.

**Read [CLAUDE.md](CLAUDE.md) first.** Despite its name it is the project guide for
everyone: architecture, house rules, and the traps that have already caught people.
Everything in it applies to you. `design/` is the authority for anything visual.

## Analytics is not optional

Every change that adds or changes something a visitor can interact with must follow
[docs/ANALYTICS.md](docs/ANALYTICS.md). Read it before you add a link, a button, an
event, a section or a page. In short:

- **Every link and button is tracked.** Spread `{...trackAttrs(event, params)}` onto
  it. ESLint fails one that is not.
- **Every event and parameter is declared in `lib/analytics/catalog.ts`**, with a
  full description of what it means and why it matters. Undeclared ones do not
  compile.
- **Every event has a readable sentence** in `lib/analytics/sentences.ts`.
- **Run `npm run analytics:docs` after changing the catalog**, and commit
  `docs/ANALYTICS-EVENTS.md`. CI fails if it is stale.
- **Never send personal data.** No names, emails, phone numbers, reviewer names,
  copied or typed text, or fingerprints.
- **Never call `gtag` or `dataLayer` directly**, outside `lib/analytics/gtag.ts`.
- **Never add another analytics tool or tag.**
- **If what is collected changes, update `privacyCopy` in `content/copy.ts`.**
- **New parameters must be registered in GA.** If you cannot do that, say so in your
  final report, and name them.

## Before you call something done

```bash
npm run typecheck && npm run lint && npm run analytics:docs -- --check && npm run build
```
