import type { RoastLevel } from "./types";

export const fourSixMethod = {
  id: "four-six-method",
  waterRatio: 15,
  finishTimeSec: 210,
  waterTemperatures: {
    light: 93,
    medium: 88,
    dark: 83,
  } satisfies Record<RoastLevel, number>,
} as const;
