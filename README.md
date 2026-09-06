# 46timer - Perfect Pour Over Coffee, Every Time

A precision timer for the award-winning 4:6 coffee brewing method. Get consistently delicious coffee with an elegant, easy-to-follow interface.

## What's the 4:6 Method?

A game-changing pour-over technique by World Brewers Cup Champion Tetsu Kasuya that gives you total control over your coffee's strength and flavor profile by dividing water into strategic pours:
- 40% of water for taste control (acidity vs. sweetness)
- 60% of water for strength control (light vs. strong)

## Features

✨ **Smart Guidance**
- Visual progress tracker
- Lottie pour guides with precise timing
- Offline first-step, next-step, and finish voice cues
- Available in English and Japanese
- Coffee news after the brew is complete

⚡ **Fully Customizable**
- Adjust coffee amount and roast level
- Fine-tune taste balance
- Control brew strength
- Get precise water measurements

## Tips
- Start with a coarse grind - the 4:6 method requires all water to drain within 3:30
- Use the visual timeline to gauge if your grind size needs adjustment
- If water isn't draining fast enough, adjust to a coarser grind

## Quick Start

1. Visit [46timer](https://46timer.pages.dev/)
2. Choose the bean amount, flavor, strength, and roast level on the setup page
3. Start the timer and follow the guided pours
4. Enjoy your coffee and browse the latest coffee news

The canonical app URLs are `/ja/setup`, `/ja/timer`, `/en/setup`, and
`/en/timer`. Recipe parameters continue to use the existing query string, for
example:

```text
/en/setup?beans=20&flavor=middle&strength=medium&roast=medium
```

Opening a shared language URL does not overwrite the saved language preference.
The preference changes only when English or Japanese is selected in the settings
dialog. Legacy URLs such as `/`, `/en/`, `/ja/`, and `/timer` redirect to a safe
canonical page while preserving the query string and hash.

The total water amount is calculated automatically at a coffee-to-water ratio of
1:15. Flavor balance, brew strength, roast level, pour amounts, and timings remain
specific to the 4:6 method.

## For Developers

Built with React + TypeScript, featuring:
- Material-UI components
- Separate setup, timer, and completed states
- Integrated current-step, Lottie animation, and timeline card
- Offline voice guidance
- Completion news from `https://daily-brew.takatama.workers.dev/news`
- Cloudflare Pages hosting

### Voice Guidance
The 12 committed WAV files cover first-step, next-step, and finish cues for male
and female voices in English and Japanese. They were copied from Neo Brew Timer
commit `1afca8c`. The current cue is allowed to finish when the URL language
changes; the next cue uses the new language. Voice assets are stored in
`public/audio/`.

The original assets were generated from SSML such as:

```xml
<speak>
  <par>
    <media xml:id="three" begin="0s">
      <speak><prosody rate="x-fast">3</prosody></speak>
    </media>

    <media xml:id="two" begin="three.begin+1.0s">
      <speak><prosody rate="x-fast">2</prosody></speak>
    </media>

    <media xml:id="one" begin="two.begin+1.0s">
      <speak><prosody rate="x-fast">1</prosody></speak>
    </media>

    <media begin="one.begin+1.0s">
      <speak><prosody rate="medium">Next Step!</prosody></speak>
    </media>
  </par>
</speak>
```

Uses Google Cloud Text-to-Speech Wavenet voices:

- English
  - Male: en-US-Wavenet-J
  - Female: en-US-Wavenet-H
- Japanese
  - Male: ja-JP-Wavenet-D
  - Female: ja-JP-Wavenet-B

### Development

```bash
git clone https://github.com/takatama/46timer.git
cd 46timer
npm install
npm run dev
```

Validation commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

### Shared timer source

The recipe-independent timer core was synchronized from Neo Brew Timer commit
`1afca8c`, also used by COCO Timer commit `37bfd97`. The copied code lives inside
this repository under `src/shared/brew-timer`, so a standalone clone still builds.
The pour animation at `public/assets/lottie/pour.json` was also copied from Neo
Brew Timer commit `1afca8c`. All active 4:6 pouring steps use this one appropriate
animation; switch and cooling animations are intentionally not included. The 4:6
calculation, wording, and Material UI connection remain local to 46timer.

### Coffee news

The completion page requests language-specific news from the Daily Brew API. If
the service cannot be reached or returns invalid data, brewing still completes
normally and the page shows a short unavailable message instead.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request to suggest changes or improvements.

## Acknowledgements
- [Tetsu Kasuya](https://www.instagram.com/tetsukasuya/) for creating the 4:6 method
- [Cloudflare](https://pages.cloudflare.com/) for hosting
