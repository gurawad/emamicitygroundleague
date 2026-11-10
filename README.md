# Emami City Ground League — Rebuild V6

A fresh static-site rebuild for GitHub Pages. It is designed around the user's selected direction: hybrid dark/light presentation, latest season first, and season-specific player share cards by default.

## Files
- `index.html`, `styles.css`, `app.js`: new front end
- `egl-data.json`: structured source-derived tournament archive and existing Season 2 intelligence data
- `assets/`: supplied player, team and sponsor images

## Deploy
1. Back up the existing GitHub repository.
2. Upload the contents of this folder to the repository root (not the enclosing folder).
3. Ensure `assets/` and `egl-data.json` sit beside `index.html`.
4. Commit and allow GitHub Pages to deploy.

## Data notes
- The archive has 135 player profiles, 16 season-team entries, 30 matches, 16 standings rows and season-specific sponsor records.
- Season 1 and Season 2 remain distinct. Combined player totals use the supplied career total fields.
- Season 1/2 standings preserve the source workbook's column values.
- Match timings appear only in Match Centre, never in standings.
- Season 1 title sponsor is GRACO; Season 2 exclusive partner is MC Financial Services. Player share cards default to EGL 2.0 and change partner branding with season selection.
- Intelligence scores are presented separately from official tournament statistics.
- Player award rows are sourced from the archive; team awards are displayed in the Hall of Fame championship cards. Sponsor/owner felicitation details are not displayed as awards.

## Important
This is a static GitHub Pages release. It does not yet connect to Supabase or a private admin system. Validate the live site and records before treating it as a final certified release.
