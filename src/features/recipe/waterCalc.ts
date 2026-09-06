import { fourSixMethod } from "./recipe";
import type { ComputedStep, FlavorProfile, RoastLevel, StrengthProfile } from "./types";
export {
  formatTimerTime as formatTime,
  getCurrentStepIndex,
} from "../../shared/brew-timer";

export function getTotalWater(beans: number): number {
  return Math.round(beans * fourSixMethod.waterRatio);
}

export function getWaterTemperature(roast: RoastLevel): number {
  return fourSixMethod.waterTemperatures[roast];
}

export function computeSteps(
  beans: number,
  flavor: FlavorProfile,
  strength: StrengthProfile,
): ComputedStep[] {
  const total = getTotalWater(beans);
  const flavorTotal = Math.round(total * 0.4);
  const firstShare = flavor === "sweet" ? 0.4 : flavor === "sour" ? 0.6 : 0.5;
  const firstPour = Math.round(flavorTotal * firstShare);
  const flavorPours = [firstPour, flavorTotal - firstPour];
  const strengthPourCount = strength === "light" ? 1 : strength === "strong" ? 3 : 2;
  const strengthTotal = total - flavorTotal;
  const steps: ComputedStep[] = [];
  let cumulative = 0;

  flavorPours.forEach((increment, index) => {
    cumulative += increment;
    steps.push({
      timeSec: index * 45,
      actionType: index === 0 ? "bloom" : "pour",
      increment,
      cumulative,
    });
  });

  for (let index = 0; index < strengthPourCount; index += 1) {
    const nextCumulative = flavorTotal + Math.round((strengthTotal * (index + 1)) / strengthPourCount);
    const increment = nextCumulative - cumulative;
    cumulative = nextCumulative;
    steps.push({
      timeSec: strengthPourCount === 1 ? 90 : 90 + (120 / strengthPourCount) * index,
      actionType: "pour",
      increment,
      cumulative,
    });
  }

  steps.push({ timeSec: fourSixMethod.finishTimeSec, actionType: "none", increment: 0, cumulative: total });
  return steps;
}
