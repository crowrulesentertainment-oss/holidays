# Seasonal photography production workflow

This site currently has no approved local photo assets. Do not mark the photography phase complete or embed remote search results as if they were licensed and reviewed.

## Intake checklist
1. Choose a specific placement (homepage hero, seasonal experience, holiday hub, activity card) and write what the image needs to communicate.
2. Prefer original CrowRules photography/commissioned art or a clearly licensed source. Save the source page, creator, exact license and license URL; do not rely on a search-result thumbnail.
3. Check whether commercial reuse, cropping, conversion and redistribution are allowed. Record required attribution and any restrictions.
4. For culturally specific imagery, ask a knowledgeable reviewer from the represented community to confirm context, clothing, symbols, ritual and caption. Do not infer cultural accuracy from automated metadata.
5. Write useful alt text describing the image's relevant information, not keywords. Use empty alt text only for genuinely decorative imagery.
6. Keep the original source asset in a private editorial workspace; publish only optimized derivatives and the completed metadata record.

## Optimization target
- Generate AVIF and WebP variants at 480, 768, 1200 and 1600 pixels wide (preserve aspect ratio).
- Keep card images under 140 KB and hero images under 350 KB when quality remains acceptable.
- Use a picture element with AVIF, WebP, then JPEG fallback; include srcset, sizes, explicit dimensions and loading=lazy for below-the-fold imagery. Use fetchpriority=high only for the single above-the-fold hero.
- Strip EXIF GPS and other unnecessary metadata before publishing.
- Test crops at mobile and desktop breakpoints and check contrast behind any text overlays.
- Commit derivative files under assets/images/ only after review and add each image to assets/data/photo-review-manifest.json.

## Publication gate
The editorial manifest must identify provenance, license, attribution, review owner/date, alt text, original dimensions and optimized variants. An empty manifest means no images are cleared for production. A technical license field is not a substitute for legal or cultural review.
