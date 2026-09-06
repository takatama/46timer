# 46timer Specification

## Purpose

Provide the 4:6 brewing method in the same visual and interaction framework as
Neo Brew Timer, while keeping 46timer's recipe choices and shared URLs.

## Pages

- `/{language}/setup`: bean amount, calculated water, flavor, strength, roast,
  temperature, recipe details, and the start button.
- `/{language}/timer`: recipe chips, edit link, integrated step card, timeline,
  startup/next preview, play/pause/reset controls, completion card, and news.
- Supported languages: `ja` and `en`.

## Recipe

Total water is beans × 15. The first 40% is split 40/60 for sweet, 50/50 for
balance, or 60/40 for sour. The remaining 60% is delivered in one, two, or three
pours for light, medium, or strong. Pour times are 0:00, 0:45, then from 1:30
through the selected strength schedule. Every recipe finishes at 3:30.

Roast temperatures are 93℃ for light, 88℃ for medium, and 83℃ for dark.

## Timer behavior

- One elapsed-time source determines the current step and countdown.
- Notifications and the next-step preview begin exactly five seconds before a
  transition.
- With animation enabled, starting shows the first-step preview for five seconds.
- Canceling that preview must not leave a delayed timer start behind.
- Resuming a paused brew does not replay the first-step voice.
- Reset requires confirmation and is not shown on the completed screen.

## Settings and persistence

The shared settings dialog controls language, sound, voice, vibration, animation,
and developer speed. Settings persist under `46timer-settings`. The old flat
settings object and the `46timer-language` preference are migrated when present.

Recipe choices remain in the URL using `beans`, `flavor`, `strength`, and `roast`.
Query strings and hashes survive routing and language changes.

## External data

The completed screen requests up to five localized items from
`https://daily-brew.takatama.workers.dev/news`. A failed request must leave the
completion card usable and show a short unavailable message.
