# Cinematic holiday photography rollout

The holiday detail page supports approved local photography, responsive gallery layouts, visible attribution, meaningful alt text and a no-photo fallback. The production manifest intentionally remains empty until a real source asset has passed review.

## Editorial intake
1. Choose the holiday, placement and story the image should tell. Prefer CrowRules-owned/commissioned imagery or an asset whose exact license permits commercial reuse, cropping, conversion and redistribution.
2. Save the original in the private editorial workspace. Record the source page, creator, license name and URL, attribution text, commercial-use permission and original dimensions.
3. Have an editor review composition, accuracy, dignity and context. For culturally specific imagery, record a reviewer with relevant community knowledge; open licensing is not cultural approval.
4. Write useful alt text. Do not use keyword stuffing or guess a creator, license or reviewer to satisfy validation.
5. Set status to approved only after all required fields are present.

## Local optimization
- Install the build-only dependency in a clean environment: npm install --no-save sharp
- Place each reviewed original at editorial/photo-inbox/<originalFile> and run node scripts/optimize-approved-photos.mjs
- The pipeline creates AVIF, WebP and JPEG fallbacks at 480, 768, 1200 and 1600 pixels under assets/images/holidays/<asset-id>/
- Check file sizes and crops before commit. The pipeline re-encodes images rather than copying original metadata; review metadata stripping before publication.
- Hero images use high fetch priority. Gallery images load lazily and declare intrinsic dimensions. Layout adapts from a desktop editorial mosaic to two columns on mobile and one column on narrow screens.

## Manifest record contract
Each approved item needs id, status: approved, holidaySlugs, title, originalFile, sourceUrl, creator, licenseName, licenseUrl, commercialUseAllowed: true, attributionText, culturalContextReviewer, altText, reviewedBy and reviewedAt. Generated fields include files with local avif, webp and jpg paths plus dimensions and responsive variant metadata.

## Accessibility and performance QA
- Check alt text, keyboard focus, contrast, attribution visibility and the no-photo fallback.
- Test at 320, 390, 768, 1024 and 1440 CSS pixels and with reduced motion enabled.
- Keep card variants under 140 KB and hero variants under 350 KB when quality remains acceptable.
- Review LCP, CLS and transfer size on representative pages before rollout.

## Honest launch status
The page code and optimization pipeline are ready, but no cleared originals are committed yet. The gallery shows an accessible fallback until an editor adds licensed and culturally reviewed assets. Do not claim the photography rollout is fully populated until approved images and local derivatives are committed.
