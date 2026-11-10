# Emami City Ground League — Ultimate Master Website V5

This is a full presentation and navigation overhaul of the existing GitHub Pages website.
It is intended to replace the website files in the repository root while retaining the
existing repository and URL:

https://gurawad.github.io/emamicitygroundleague/

## Package contents
- `index.html` — redesigned responsive homepage, single navigation, Hall of Champions
- `app.js` — existing Season 2 player/team intelligence, comparison and share-card features
- `archive.js` — official historical archive rendering
- `data.json` — Season 2 intelligence dataset
- `archive_data.json` — Seasons 1 and 2 player, team, match, standings, award and sponsor records
- `assets/` — supplied logos and player photographs

## Important display and data rules
- The homepage uses the two-season master archive context: 135 player identities and 30 match records.
- Hall of Champions: EGL 1.0 — Master Blasters (runners-up Strikers); EGL 2.0 — Mangrove Blasters (runners-up Gladiators).
- League standings contain competition metrics only. Match duration, playing time, innings duration and time-per-over are shown only in Match Results & Timing.
- Team awards show only Champions and Runners-up; player awards remain in the player awards view.
- Official EGL tournament statistics, external CricHeroes career context and provisional AI intelligence are kept distinct.
- Blank values remain unknown; do not convert blanks to zero.
- The 96 Season 2 official participants remain part of the register, including players without a batting or bowling opportunity.

## Deploy to GitHub Pages
1. Download a backup of the current repository before replacing anything.
2. Extract this ZIP. The files shown above are at the ZIP root.
3. In `gurawad/emamicitygroundleague`, upload **all files and folders from this ZIP root** to the repository root.
4. Allow same-name files to be replaced.
5. Remove obsolete duplicate/legacy HTML or archive scripts only after confirming they are not referenced. Do not delete the `assets/` folder.
6. Commit with message: `Complete EGL website overhaul — V5`.
7. Confirm Settings → Pages uses branch `main` and folder `/ (root)`.
8. Wait for deployment, then hard-refresh the website (Cmd+Shift+R) or open a private window.

## Validation after deployment
- Homepage has one Seasons Archive navigation item (no duplicate green buttons).
- Hall of Champions shows both season winners and runners-up.
- Teams & Standings has no match timing columns.
- Match Results & Timing contains match start/end, total match time and playing time where source values exist.
- Sponsor logos render; if a file is unavailable, a readable text brand mark appears instead of a broken-image symbol.
- Test desktop and mobile widths.

This package is a static GitHub Pages release. It does not deploy Supabase or the private EGL Admin Centre.
