# Emami City Ground League — Seasons 1 & 2 Website Upgrade

This package upgrades the existing static Emami City Ground League website while preserving its current Players, Teams, Rankings, Compare and Instagram Card features. It adds a historical archive for both seasons.

## Added public sections
- EGL Archive: season-specific player profiles and official season statistics
- Season-specific team identities and supplied logos
- League standings and completed match results
- Match timing fields from the source workbook (where present)
- Player awards and Champions / Runners-up only
- Sponsors & partners, with brand, sponsor/contact name and supplied logos; missing logos use text marks
- Season 1 player photographs matched only by exact normalized player-name match

## Data handling
- All 96 Season 2 participants remain in the player register, including players without batting/bowling opportunity.
- Blank source values remain unknown; no missing values are silently converted to zero.
- Season 1 and Season 2 teams are kept season-specific.
- Sponsor and team-owner award/felicitation rows are not included in the public awards archive.
- The original source workbook and original site data are not overwritten.
- This is a static read-only public site; no private credentials or admin controls are included.

## Run locally
```bash
python3 -m http.server 8000
```
Open http://localhost:8000.

## Deploy to the renamed GitHub Pages repository
1. Rename the existing repository to `emamicitygroundleague` under `gurawad` (GitHub → repository Settings → General → Repository name).
2. Confirm GitHub Pages is enabled for the intended branch and folder. The expected project-site URL is `https://gurawad.github.io/emamicitygroundleague/`.
3. Back up the repository contents or create a branch before replacing files.
4. Copy the contents of this package's `EGL_Cricket_Intelligence_Web_MVP` folder into the repository's published site root.
5. Commit and push. All site asset/script references in this package are relative, so they work under the renamed project path without hard-coded base-URL edits.
6. Verify the new URL and check Players, Teams, Rankings, Compare, Instagram Card and EGL Archive on desktop and mobile.

If the repository is renamed, update any local Git remote URL used for future pushes to `https://github.com/gurawad/emamicitygroundleague.git` (or the equivalent SSH URL). GitHub may redirect the old repository URL, but update saved remotes and external links explicitly.

No database credentials are required. This package does not deploy itself or modify the GitHub repository.
