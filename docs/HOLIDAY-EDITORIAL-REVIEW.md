# Holiday Hub editorial review process

## Photo results: do not equate license with cultural accuracy
The live Wikimedia Commons search is a candidate finder, not an editorial endorsement. A license filter alone cannot establish that an image is culturally accurate, representative, high quality, or correctly captioned.

Before a result is promoted as an approved hero/featured image, a reviewer must:
1. Open the original Commons file page and verify the exact license, creator, attribution requirements, and source.
2. Confirm the file is a genuine photograph where the UI promises a photograph; reject diagrams, logos, posters, maps, low-resolution crops, unrelated event photos, and obvious AI-generated or misleading imagery.
3. Check focus, exposure, resolution, crop safety, accessibility, and whether the alt text describes what is actually visible.
4. Verify cultural context with a reliable museum, cultural organization, official event organizer, or community-led source. Do not infer a person's religion, ethnicity, identity, or role from appearance.
5. For religious and heritage observances, check symbols, objects, dates, and setting with a source specific to that tradition/region. Do not use a single image to imply one practice is universal.
6. Record the file page URL, direct source, creator, license name/URL, reviewer, review date, context source, and decision in `assets/data/photo-review-manifest.json`.
7. If no candidate passes, show the Commons search link and no image. Never silently substitute a generic or unlicensed image.

## Recipe cards: kitchen validation required
The first measured cards are editorial drafts, not honestly describable as tested until a human actually prepares them. For every recipe, the tester records:
- exact ingredient brands/weights where meaningful, equipment and pan size;
- prep time, actual bake/cook time, yield, and observable doneness;
- whether the quantities work, texture/flavor outcome, and any revisions;
- food-safety and allergen review, storage/reheating guidance where relevant;
- tester name/initials, test date, version, and approval status.

Only change a recipe status to `Kitchen-tested` after a real test and revision review. Do not invent a test result. Recipe adaptations should be identified as adaptations; avoid claiming a dish represents every household or community.

## Date verification and countdown release gate
The monthly GitHub Actions workflow opens a review issue. A maintainer must:
1. Identify the relevant tradition, region, and year. Do not treat all communities as having the same observance date.
2. Compare at least two credible sources where possible, including a community authority for lunar/religious observances and a recognized calendar/astronomical source where applicable.
3. Record source URLs, source publication/update date, date checked, local timezone/region, whether the date begins at sundown, and whether moon-sighting or local authority can change it.
4. Keep the countdown paused if sources conflict, the date is only an estimate, or the target location/tradition is unspecified.
5. Update the central date manifest and run site checks. Countdown eligibility is explicit opt-in per slug; do not infer eligibility from the presence of a date string.
6. Re-check before each observance season and when an authoritative calendar changes. Monthly reminders are a prompt for human verification, not proof the date is verified.

## Acceptance criteria
- Candidate photo search results are never described as culturally reviewed by default.
- Every featured image has verified reuse rights and complete attribution.
- Recipe cards show measured quantities and method, and the test state is honest.
- Lunar/religious countdowns remain disabled until a maintainer records sources and approves the exact region/tradition/year.
