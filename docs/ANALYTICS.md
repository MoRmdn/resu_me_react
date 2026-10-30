# Analytics

How this site measures what visitors do, and the rules every person and every
agent must follow when changing it.

The full list of events is in [ANALYTICS-EVENTS.md](ANALYTICS-EVENTS.md), which is
generated. This file is the rules.

**The goal:** every click is recorded, every record explains itself, and we can
rank projects by real interest.

## Rules

These apply to every change, by anyone. CI enforces the ones marked **(enforced)**.

1. **Every link and button is tracked (enforced).** Spread `trackAttrs()` onto it.
   ESLint fails an `<a>`, `<button>` or `Link` that does not.
2. **Every event and parameter is declared in `lib/analytics/catalog.ts`
   (enforced).** An undeclared one does not compile.
3. **Every event and parameter has a full description (enforced).** Write it for
   someone reading a report a year from now: what it means, and why it matters. A
   short description fails the check.
4. **Every event has a readable sentence in `lib/analytics/sentences.ts`
   (enforced).** It is sent with the event as `event_description`.
5. **The generated docs stay current (enforced).** Run `npm run analytics:docs`
   after changing the catalog, and commit the result.
6. **Never send personal data.** No name, email, phone number, reviewer name,
   copied text, typed text or IP address, and no fingerprinting. Google's terms
   forbid it and the site does not need it. Review ids contain first names, which
   is why events send `review_ref`, a hash. If you are unsure about a value, leave
   it out.
7. **Never bypass the catalog.** No `gtag()` or `dataLayer` calls outside
   `lib/analytics/gtag.ts`, no second analytics tool, and no extra tags.
8. **Never load anything that sets cookies before consent is handled.** See
   [Consent](#consent).
9. **Do not add analytics to the critical path.** gtag.js loads after `load` at
   idle. Do not move it, and do not drive React state from tracking.
10. **Register new parameters in GA** in the same change. See
    [GA setup](#ga-setup). Unregistered parameters do not appear in reports. If you
    cannot reach GA, say so in your final report.

An exception to rule 1 needs an `eslint-disable-next-line` comment with a written
reason.

## How it works

```
lib/analytics/
  catalog.ts     every event and parameter, with descriptions. Types only at runtime
  sentences.ts   the readable sentence for each event. Ships to the browser
  attrs.ts       trackAttrs() and friends. Safe in server components
  gtag.ts        the only file that talks to Google. Host gate, consent, track()
  listeners.ts   one delegated listener each for click, copy, hover, swipe, errors
  attention.ts   the dwell engine
components/analytics/
  AnalyticsRoot.tsx   mounted once, in app/layout.tsx
  ConsentNotice.tsx   the regional notice, and the control on /privacy/
```

**Clicks are data, not handlers.** `trackAttrs()` writes two data attributes. One
capture-phase listener on `window` reads them. So tagging a link adds no
JavaScript and never turns a server component into a client component.

**Anything missed is still caught.** A control with no `data-track` sends
`ui_click` and warns in the dev console. A click on something that is not a control
sends `content_click`. A `ui_click` in reports is a bug to fix.

**Dwell time comes from a one-second tick**, in `attention.ts`. It finds the most
visible project, so only one counts at a time and totals cannot exceed the time
actually spent. It stops after 30 seconds with no input, and while the tab is
hidden. A stop under two seconds is someone scrolling past, and records nothing.

Gallery tiles sit side by side, so screen time cannot separate them. They report
`project_hover`, and their detail plane gets dwell once open. A closed plane has no
height, so it never registers.

## How to

### Track a new link or button

```tsx
<a href={url} {...trackAttrs("about_link_click", { link_text: title, link_url: url })}>
```

Use an existing event if one fits. A control whose attributes depend on state is
fine, since they are read before React updates:

```tsx
{...trackAttrs("project_toggle", { ...params, toggle_action: isOpen ? "close" : "open", toggle_method: "tile" })}
```

### Track something that is not a click

For a timer, a key press or a state change, call `track()` from a client component:

```ts
track("project_toggle", { ...projectParams(project, "gallery"), toggle_action: "close", toggle_method: "escape" });
```

### Add a new event

1. Add it to `EVENTS` in `catalog.ts`: group, description, trigger and params.
2. Add any new parameters to `PARAMS`, each with a description.
3. Add its sentence to `sentences.ts`.
4. Run `npm run analytics:docs`.
5. Register any new parameters in GA.

### Add a project

Nothing to do. Project panels and tiles take their parameters from `content/`.

### Add a section

Nothing to do, as long as it renders as `<section id="...">`. `Section` does.

### Add a page

`AnalyticsRoot` is in the root layout, so it is covered. Give its content a
`<section id="...">`, and add the page to the `must-revalidate` list in
`firebase.json`.

### Time something new

Spread `attentionAttrs()` onto it, and add the kind to `attention.ts`. Put it on an
element whose height is zero when closed, as the `.disclosure` panels do.

## Naming

- Events and parameters are `snake_case`, written as `object_action`:
  `project_link_click`, not `clickProjectLink`.
- Reuse a parameter before adding one. `link_url` always means the same thing.
- Do not use GA's reserved names, such as `click`, `scroll`, `page_view`,
  `first_visit`, or the prefixes `ga_`, `google_` and `firebase_`.
  `analytics:docs` rejects them.

## GA limits

`analytics:docs` checks all of these.

| Limit | Value |
|---|---|
| Event name | 40 characters |
| Parameter name | 40 characters |
| Parameter value | 100 characters; `sendEvent` cuts longer ones |
| Parameters per event | 25 |
| Event-scoped custom dimensions | 50 |
| User-scoped custom dimensions | 25 |
| Custom metrics | 50 |

Do not put high-variety values such as timestamps in a dimension. Reports collapse
rare values into `(other)`.

## Consent

Visitors in the EU, UK and Switzerland see a small notice. Until they accept, GA
runs cookieless. Everyone else is tracked with no notice. Anyone can change their
choice on `/privacy/`.

- **Who sees the notice:** a browser time zone in Europe. A static site has no
  server to ask where a visitor is.
- **The backup:** a Google `region` consent default, for visitors whose time zone
  and location disagree. It errs towards denied, so a mismatch can only collect
  less.
- **Accept:** `analytics_storage` is granted.
- **Decline:** cookies are removed, and nothing more is sent. The decline itself is
  the last event.
- **Ad storage** is always denied, and Google signals stay off. On a site this size,
  signals trigger thresholding, which hides rows from reports.

Changes to what is collected must be reflected in `privacyCopy` in
`content/copy.ts`, which is what visitors are told.

## Testing

Only `https://mormdn.com` sends data. Localhost, preview channels and
`m0rmdn.web.app` send nothing, so testing never pollutes the numbers.

| Query flag | Effect |
|---|---|
| `?analytics_debug=1` | Logs every event to the console, on any host, for this tab |
| `?analytics_region=eu` | Behaves as a visitor in a consent region (`=other` to reverse) |
| `?internal=1` | Tags this browser as the owner's (`?internal=0` clears it) |

On the live site, `?analytics_debug=1` also sends events to GA DebugView.

**The owner should visit `https://mormdn.com/?internal=1` once on each browser and
device**, so their own visits are excluded.

## Reading the data

### Which project is most interesting

Explore → Free form:

- **Rows:** Project (`project_title`)
- **Columns:** Event name
- **Values:** Event count, Dwell seconds
- **Filter:** Event name is one of `project_impression`, `project_dwell`,
  `project_toggle`, `project_link_click`

Read it in this order, strongest signal first:

1. `project_link_click`: they left to see the real thing.
2. Total dwell seconds: how long it held people.
3. `project_toggle` opens: they asked for more detail.

Compare projects by **dwell seconds per impression**. Projects near the top of the
page are seen by more people, so raw totals favour them.

### Which platform sends visitors

Use tagged links on every profile, then read Reports → Acquisition → Traffic
acquisition, by source:

```
https://mormdn.com/?utm_source=upwork&utm_medium=profile
```

### Conversions

Key events are listed in [ANALYTICS-EVENTS.md](ANALYTICS-EVENTS.md#key-events).

## GA setup

Once, after the first deploy:

1. Confirm the `G-…` ID in `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is the active web
   stream for mormdn.com.
2. Register every custom dimension and metric listed in
   [ANALYTICS-EVENTS.md](ANALYTICS-EVENTS.md#register-these-in-ga). Registering is
   not retroactive, so do it on launch day.
3. Mark the key events.
4. Admin → Data retention: set event data to 14 months. The default is 2, and the
   privacy page promises 14.
5. Admin → Data filters: activate the Internal Traffic filter.
6. Add tagged links to each marketplace profile.

Repeat step 2 whenever a parameter is added.
