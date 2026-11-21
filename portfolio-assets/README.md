# Wabrix portfolio figure

One source-backed, art-directed reconstruction of the Wabrix Knowledge Base and Bot Emulator. The support-hours source, prompt, and response are fictional demo data. The emulator is a preview; no WhatsApp message is shown as sent. The visual follows `../docs/portfolio-asset-brief.md`.

## Files

- `composition.html`: editable desktop, tablet, and mobile composition.
- `source/wabrix-logo-trimmed.png`: transparent-padding trim of `../apps/web-2/public/logo.png`, with unchanged logo pixels.
- `fonts/`: local Geist and Albert Sans TTFs with OFL license texts.
- `output/wabrix-{desktop,tablet,mobile}.png`: opaque 2250 × 1000 sRGB masters.
- `output/wabrix-{desktop,tablet,mobile}.{webp,avif}`: delivery encodings with the same dimensions.
- `output/render-qa.json` and `output/manifest.json`: render measurements and provenance.

## Regenerate

Run `npm install` in this directory, install Playwright WebKit with `npx playwright install webkit` if absent, then run `npm run render` and `npm run export`. The export step needs Pillow with AVIF and WebP support.

## Portfolio copy

Alt text: Wabrix Knowledge Base source beside a bot preview showing a response drawn from that source.

Caption: Wabrix Knowledge Base and Bot Emulator — interface reconstruction with fictional demo knowledge; preview only, no WhatsApp message sent.

For the existing 2.25:1 Home and Work figure, use `desktop` at wide widths, `tablet` around 768px, and `mobile` near 390px. Use the `mobile` image within the existing 3:2 related-thumbnail contain box; its larger shapes survive reduction. The separate portfolio site is outside this artifact.

The reconstructed `1 chunk used` label corrects the current UI's literal singular copy (`1 chunks used`); the underlying count and matched-source behavior are unchanged.

The HTML uses original geometry rather than copied third-party UI code. Font licenses are included. The repository's `apps/web-2/THIRD_PARTY_NOTICES.md` remains the reference if later production copies third-party components or assets.
