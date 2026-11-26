# GitHub

- **Profile:** https://github.com/MoRmdn. Not a marketplace, but it carries the same title and the NAAS entry.
- **Profile README:** repo `MoRmdn/MoRmdn`, file `README.md`, branch `main`.

## State, synced to the site 2026-11-07

- **README:** title "Software Engineer · Cross-Platform Mobile and Web Applications"; a line in `$ whoami` about
  NAAS; the old MisMar driver-app entry in "Published apps" was removed and a **Current role** section with
  **NAAS Dashboard** was added. Commit `7fc0fb3`, pushed to `main` directly (it is a solo profile repo).
- **Banner:** GitHub has no profile banner field, so a banner made for GitHub (1280×320, `$ whoami` and the name) sits at
  the top of the profile README as `banner.png` in the `MoRmdn/MoRmdn` repo (2026-11-07). Its source is the "GitHub README"
  board of the Claude Design canvas "MoRmdn Profile Banners": change the numbers in its Tweaks, export the PNG, and
  replace `banner.png` there, then commit and push.
- **Bio** (a profile setting, 160 characters): "Software Engineer · Flutter, Firebase & React · Apps on App
  Store & Google Play" was first set, then changed to "Software Engineer · Cross-Platform Mobile and Web
  Applications · Apps on App Store & Google Play" to match the site title.
- **README, 2026-11-26:** the MisMar row in the experience table says "Software Engineer" (commit `977ab69`).
  The degree line already read "B.Sc. Computer Science — Bioinformatics".
- **Left alone:** the profile's name field is empty and its location reads "127.0.0.1" (probably a joke).

## Editing

- README: `gh repo clone MoRmdn/MoRmdn`, edit, commit, push.
- Bio: `gh api -X PATCH user -f bio=...` needs the `user` scope that the `gh` login does not have. Use
  https://github.com/settings/profile in the signed-in browser instead: set the bio textarea
  (`user[profile_bio]`) and click "Update profile". It saves with a page reload; check with `gh api user --jq .bio`.
