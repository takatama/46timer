export type FlavorProfile = "sweet" | "neutral" | "sour";
export type StrengthProfile = "light" | "medium" | "strong";
export type RoastLevel = "light" | "medium" | "dark";

export type ActionType = "bloom" | "pour" | "none";

export interface ComputedStep {
  timeSec: number;
  actionType: ActionType;
  cumulative: number;
  increment: number;
}
