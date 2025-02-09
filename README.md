# 46timer - Perfect Pour Over Coffee, Every Time

A precision timer for the award-winning 4:6 coffee brewing method. Get consistently delicious coffee with an elegant, easy-to-follow interface.

## What's the 4:6 Method?

A game-changing pour-over technique by World Brewers Cup Champion Tetsu Kasuya that gives you total control over your coffee's strength and flavor profile by dividing water into strategic pours:
- 40% of water for taste control (acidity vs. sweetness)
- 60% of water for strength control (light vs. strong)

## Features

✨ **Smart Guidance**
- Visual progress tracker
- Animated pour guides with precise timing
- Voice countdown with natural speech synthesis
- Available in English and Japanese

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
2. Set your preferences
3. Follow the guided pours
4. Enjoy your perfect cup!

## For Developers

Built with React + TypeScript, featuring:
- Material-UI components
- Voice synthesis (SSML)
- Cloudflare Pages hosting

### Voice Guidance
The app uses SSML (Speech Synthesis Markup Language) to create natural-sounding countdown voice cues before each step:

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

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request to suggest changes or improvements.

## Acknowledgements
- [Tetsu Kasuya](https://www.instagram.com/tetsukasuya/) for creating the 4:6 method
- [Cloudflare](https://pages.cloudflare.com/) for hosting
