# Storage, access technologies and consent model

Internal document. Verified 2026-07-31 by live browser inspection of
optaradigital.com (not source-search alone).

## Inventory

| Technology | Found |
|---|---|
| Cookies (first-party) | **None** — no `Set-Cookie` on any route, `document.cookie` empty |
| Cookies (third-party) | **None** — zero third-party requests occur |
| localStorage | **None** |
| sessionStorage | **None** |
| IndexedDB | **None** |
| Service workers / cache identifiers | **None** |
| Pixels, tags, beacons | **None** |
| Embedded third-party media | **None** |
| Fonts | Self-hosted via next/font (no request to Google) |
| Analytics identifiers | **None** — no analytics exists |
| Consent-preference storage | **None** — none is needed (see below) |

Checked on: first visit with empty storage, after route navigation, after
typing into the contact form, after homepage WebGL interaction. All resources
load from optaradigital.com only.

## Classification

There is nothing to classify: the site stores nothing on, and reads nothing
from, the user's device. No technology falls under the PECR/DUAA storage-and-
access rules because none is used.

## Consent model — Outcome A: no banner

No consent-requiring technology exists, so no consent banner is shown.
Displaying a decorative cookie banner on a site that sets no cookies would
misdescribe the site's behaviour, which this project does not do.

Consequences:

- No consent banner, no preference centre, no "Cookie settings" footer control
  (there is nothing for it to control — the brief's own rule).
- The Cookie Policy states plainly that no cookies or similar technologies are
  currently used, and commits to updating the policy and adding appropriate
  controls before any such technology is introduced.
- The 25 consent tests in the sprint brief that presuppose a banner are
  **not applicable**; the tests that do apply (first visit stores nothing,
  navigation stores nothing, form use stores nothing, reload stores nothing,
  no third-party request ever fires) were executed against production and
  passed.

## Trigger for revisiting

This model is valid only while the above inventory stays empty. Introducing
ANY of the following requires re-running this assessment BEFORE deployment:
analytics, embedded video, maps, CAPTCHA, chat, error monitoring with
client SDK, A/B testing, fonts from a third-party CDN, or any script that
sets storage. Gate such work on a consent implementation first.
