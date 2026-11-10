# Emami City Ground League — Seasons 1 & 2 website upgrade

## What's changed in this revision
- Removed duplicate Seasons Archive navigation buttons, duplicate archive sections and repeated archive.js script tags.
- Updated the homepage copy to cover Seasons 1.0 and 2.0.
- Added a Combined career option in the historical player archive, showing available all-time additive totals and a Season 1 / Season 2 split.
- Added explicit fallback text marks if a sponsor or team logo image cannot load.
- Kept sponsor brand names and sponsor/contact names from the supplied workbook.
- Kept auction price in the Season 2 player detail modal and player comparison.
- Retained source match timing fields.

## Missing Season 1-only player photographs
See `EGL_Season1_Missing_Player_Photos.csv` in the package root. Please upload each image into `assets/` using the filename `player-eglp###.jpg` shown by the EGL Player ID (for example `player-eglp102.jpg`). The data file can then be updated to point to the image.

## GitHub Pages deployment
1. Back up the current repository.
2. Upload the **contents** of this folder (`index.html`, `app.js`, `archive.js`, JSON files and `assets/`) to the repository root.
3. Make sure the `assets` folder is at the same level as `index.html`. Do not upload the outer folder as a nested folder.
4. Commit to `main`; GitHub Pages should publish from `main / (root)`.
5. Hard-refresh the live site after deployment.

## Data interpretation
- Main Players / Teams / Rankings / Compare / Intelligence modules are based on the Season 2 squad dataset. Prior-season EGL indicators refer to Season 1. Career context fields in the intelligence dataset may include CricHeroes competitions outside EGL and are labelled separately.
- The archive provides season-specific official EGL statistics and a combined career view for additive totals. Combined rate statistics are not fabricated; batting average, strike rate, bowling average and economy should be calculated only when their denominators and fielding definitions are validated.
- Blank source values remain unknown, not zero.
- Player auction price is included in the Season 2 intelligence dataset as `Auction_Price_INR` and appears in the player detail and comparison views.

This is a prepared website package, not a confirmation that GitHub Pages has deployed it.


## Season 1 photo update
Eight additional user-supplied photos have been matched to EGLP029, EGLP102, EGLP108, EGLP110, EGLP111, EGLP116, EGLP125 and EGLP128. Four previously identified Season 1-only profiles still require photos: EGLP121 Sanjay Khaitan, EGLP124 Subham Tantia, EGLP127 Tarun Dokania and EGLP134 Yatharth Kakrania.
