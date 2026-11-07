# GitHub

- **Profile:** https://github.com/MoRmdn. Not a marketplace, but it carries the same title and the NAAS entry.
- **Profile README:** repo `MoRmdn/MoRmdn`, file `README.md`, branch `main`.

## State, synced to the site 2026-11-07

- **README:** title "Software Engineer · Cross-Platform Mobile and Web Applications"; a line in `$ whoami` about
  NAAS; the old MisMar driver-app entry in "Published apps" was removed and a **Current role** section with
  **NAAS Dashboard** was added. Commit `7fc0fb3`, pushed to `main` directly (it is a solo profile repo).
- **Bio** (a profile setting, 160 characters): "Software Engineer · Flutter, Firebase & React · Apps on App
  Store & Google Play" was first set, then changed to "Software Engineer · Cross-Platform Mobile and Web
  Applications · Apps on App Store & Google Play" to match the site title.
- **Left alone:** the profile's name field is empty and its location reads "127.0.0.1" (probably a joke).

## Editing

- README: `gh repo clone MoRmdn/MoRmdn`, edit, commit, push.
- Bio: `gh api -X PATCH user -f bio=...` needs the `user` scope that the `gh` login does not have. Use
  https://github.com/settings/profile in the signed-in browser instead: set the bio textarea
  (`user[profile_bio]`) and click "Update profile". It saves with a page reload; check with `gh api user --jq .bio`.
