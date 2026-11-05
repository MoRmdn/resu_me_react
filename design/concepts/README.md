# Layout concepts

Five working prototypes of other ways to present the portfolio than one long
scroll. They are references for a redesign, not production code: plain HTML,
CSS and JavaScript, built on a snapshot of `content/` in `data.js`.

| File | Concept |
|---|---|
| `1-app.html` | **App mode.** The portfolio is a mobile app in a device frame: tabs, a swipeable rail, a pushed detail screen. On a phone it fills the screen. |
| `2-bento.html` | **Bento dashboard.** Everything on one screen as tiles; a tile opens into a full sheet. |
| `3-chapters.html` | **Chapters.** Six full-screen chapters side by side, moved by arrow keys, the wheel or a chapter bar. |
| `4-stories.html` | **Stories.** Seven tap-through cards that advance on their own, made for phones. `?d=` sets the time per card in ms. |
| `5-map.html` | **Map hub.** The client map is the home page; a country opens its clients, apps, teams and reviews. |

They load images from `public/` by relative path, so serve the repository root
rather than opening the files directly:

```bash
python3 -m http.server 4180
```

Then open `http://localhost:4180/design/concepts/1-app.html`.

`data.js` is a snapshot and is not kept in sync with `content/`. Fonts come from
Google Fonts here only; the site itself uses `next/font`.
