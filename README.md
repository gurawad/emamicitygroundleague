# Emami City Ground League — V7

Fresh refinement release based on the approved design brief:
- Hybrid visual direction (dark sports shell with clean light data/sponsor surfaces)
- Latest season first
- Player share cards default to selected season (EGL 2.0)
- Official EGL data takes priority over external CricHeroes context

## Deploy
1. Back up the current GitHub repository.
2. Extract this ZIP.
3. Upload the contents of this folder to the root of `gurawad/emamicitygroundleague`.
4. Keep `assets/`, `index.html`, `app.js`, `styles.css`, and `egl-data.json` together at repository root.
5. Commit and wait for GitHub Pages deployment.

## V7 refinements
- Homepage: removes unverified date/venue text, shows Season 1 GRACO title sponsor and Season 2 MC Financial Services exclusive partner.
- Homepage terminology: "Official Tournament Records"; unique player and distinct team counts.
- Players: removes visible EGL player IDs from cards, aligns photos to a consistent top-aligned frame, and shows both season teams in combined profiles.
- Teams: team logo fallbacks for missing/broken image paths.
- Matches: SF1/SF2 are explicitly labelled Semi-final 1/2; match timings stay in Match Centre, not standings.
- Hall of Fame: championship cards use team logo/fallback; player awards are ordered by category; POTM is written in full.
- Sponsors: duplicate brand roles are grouped into one card; roles, sponsor names and logos have separate layout areas.
- Share a Player: includes player photo, season team, season-specific partner branding and available individual awards.
- Intelligence: row-level searchable view includes all 135 player profiles, prioritises official EGL season records and treats intelligence as secondary context.

## Data limitations (important)
- Season 1 CricHeroes career context is not yet supplied. It is not required for official EGL season statistics and can be added later as a separately labelled source.
- Combined batting average is calculated from combined runs and dismissals where available.
- Combined bowling average is shown only when source totals provide the required runs-conceded denominator for both relevant seasons. Combined strike rate/economy are not fabricated where balls-faced/overs denominators are missing.
- Missing statistics remain blank, not zero.
- Distinct team count is a name-based count pending confirmation of any renamed-team continuity.
- This remains a static GitHub Pages release; no Supabase/admin deployment is included.

## QA performed
- JavaScript syntax check (`node --check`) passed.
- JSON parsing passed.
- All 18 sponsor records retained.
- All 16 team-logo files present in the assets folder.
- Sponsor logo paths checked against packaged assets.
- 135 player records, 30 matches and 16 standings records confirmed.
- Not yet deployed or fully browser-tested against GitHub Pages.


## V8 refinement notes
- Footer wording standardized to "Official Tournament Records".
- Hall of Fame match awards display full "Player of the Match" wording.
- Sponsor brands are grouped by season and duplicate roles are consolidated into one brand card.
- Share-player selector no longer displays internal EGL player IDs.
- Intelligence remains a searchable player table; this release adds cache-busting asset versions.
- Imported serial-numbered player photos from the supplied assets.zip.
- Photo audit: 131 of 135 player images found. Missing photo files: EGLP121, EGLP124, EGLP127, EGLP134. No substitute photos were invented.
