# 46timer

46timer is a bilingual brewing timer for Tetsu Kasuya's 4:6 pour-over method.

## Brew flow

1. Choose the bean amount, flavor balance, strength, and roast level.
2. The app calculates total water at 1:15 and prepares the matching 4:6 pours.
3. Follow the integrated step card, animation preview, countdown, and timeline.
4. After the 3:30 brew, view language-specific coffee news.

Canonical routes are `/ja/setup`, `/en/setup`, `/ja/timer`, and `/en/timer`.
Legacy routes such as `/`, `/setup`, and `/timer` are redirected while preserving
the query string and hash. Shared recipe parameters use this format:

```text
/en/setup?beans=20&flavor=middle&strength=medium&roast=medium
```

The URL values are compatible with the previous 46timer. Internally, the legacy
`middle` flavor value maps to `neutral`, then maps back to `middle` when the URL
is updated.

## 4:6 recipe rules

- Total water: bean amount × 15
- First 40%: sweet = 40/60, balance = 50/50, sour = 60/40
- Remaining 60%: light = one pour, balance = two pours, strong = three pours
- Roast temperatures: light 93℃, medium 88℃, dark 83℃
- Flavor pours start at 0:00 and 0:45; strength pours start at 1:30; finish is 3:30
- Pour values are rounded to whole grams while preserving the exact final total

## Neo-based interface

The page structure, CSS Modules, design tokens, setup/timer routes, shared settings
dialog, integrated timer card, startup/next-step previews, confirmation dialog,
finish card, and shared timer core are based on Neo Brew Timer commit
`7a0b8ef9079e9e865b051ed628a8a693db06209a`.

The 4:6 calculation and legacy compatibility were checked against 46timer main
commit `e8488d0c0c645ddf49aca2838baf5013513e8fd5` and the earlier integration work
at `d5c0925e35643720f2cdca275826d7e9692d26da`.

All 12 first/next/finish voice files and `public/assets/lottie/pour.json` were
copied from the Neo reference commit. Switch and cooling animations are not used.

The previous `46timer-settings` object is migrated into the persisted Neo-style
settings shape. Language, notification mode, voice, and animation are retained.
The former dark-mode preference has no Neo equivalent and is intentionally not
shown; the Neo visual theme is the common baseline.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

The production build is a static SPA for the existing Cloudflare Pages project
`46timer`. Do not deploy it to the Neo Brew Timer project.

## License

MIT. See [LICENSE](LICENSE).
