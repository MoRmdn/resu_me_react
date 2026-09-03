# design/

The visual source of truth for this portfolio. If you're changing anything the
user can see, the answer is in here.

## Read in this order

1. **[IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)** — start here. Maps every
   spec token and section to the Dart file that owns it, and lists the layout
   invariants that will break the app if you violate them.
2. **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)** — the full "Obsidian & Copper"
   spec: colour tokens, type scale, spacing, components, motion. Ends with a
   "Not yet built" list of known spec/code gaps.
3. **[LOGO.md](LOGO.md)** — the composed-M mark: geometry, the seven approved
   variations, clear space, and what you must never do to it.
4. **[portfolio-redesign.dc.html](portfolio-redesign.dc.html)** — the original
   Claude Design artboard the Flutter app was built from. Open it in a browser
   to see the intended rendering. Reference only; not part of the build.

## The one-paragraph version

Dark-first, codename **Obsidian & Copper**. Near-black `#0A0A0C` grounds
everything; warm off-white `#F2EEE7` carries text (never pure white); a single
copper `#F2762E` marks the one most important thing on screen. Depth is drawn
with hairlines and offsets, never blur or gradients. `Archivo` for display and
body, `JetBrains Mono` for eyebrows and metadata. Layout is asymmetric — 7/5 and
8/4 splits, 1240px max width — because centred boxes read as a template.
The deliberate anti-pattern is the purple-gradient glassmorphism dev portfolio.

## House rules

- No raw hex in widget files — every colour goes through `AppColors`.
- One copper accent per viewport. Two means one is wrong.
- Never gradient two hues.
- `--bone-28` is decorative only, never information.
