import type { DynamicTranslations, Step } from "./types";

export type Flavor = "sweet" | "middle" | "sour";
export type Strength = "light" | "medium" | "strong";
export type RoastLevel = "light" | "medium" | "dark";

export interface BrewParameters {
  beansAmount: number;
  flavor: Flavor;
  strength: Strength;
  roastLevel: RoastLevel;
}

export const DEFAULT_PARAMETERS: BrewParameters = {
  beansAmount: 20,
  flavor: "middle",
  strength: "medium",
  roastLevel: "medium",
};

export function getWaterTemperature(roastLevel: RoastLevel): number {
  if (roastLevel === "light") return 93;
  if (roastLevel === "dark") return 83;
  return 88;
}

export function calculateSteps(
  beansAmount: number,
  flavor: Flavor,
  strength: Strength,
): Step[] {
  const totalWater = beansAmount * 15;
  const flavorWater = totalWater * 0.4;
  const strengthWater = totalWater * 0.6;
  const firstFlavorShare = flavor === "sweet" ? 0.4 : flavor === "sour" ? 0.6 : 0.5;
  const flavor1 = flavorWater * firstFlavorShare;
  const flavor2 = flavorWater - flavor1;
  const strengthSteps = strength === "light" ? 1 : strength === "strong" ? 3 : 2;
  const strengthPourAmount = strengthWater / strengthSteps;
  const steps: Step[] = [
    { time: 0, pourAmount: flavor1, cumulative: flavor1, descriptionKey: "flavorPour1", status: "upcoming" },
    { time: 45, pourAmount: flavor2, cumulative: flavorWater, descriptionKey: "flavorPour2", status: "upcoming" },
    { time: 90, pourAmount: strengthPourAmount, cumulative: flavorWater + strengthPourAmount, descriptionKey: "strengthPour1", status: "upcoming" },
  ];

  if (strengthSteps > 1) {
    const interval = 120 / strengthSteps;
    for (let index = 2; index <= strengthSteps; index += 1) {
      steps.push({
        time: 90 + interval * (index - 1),
        pourAmount: strengthPourAmount,
        cumulative: flavorWater + strengthPourAmount * index,
        descriptionKey: `strengthPour${index}` as keyof DynamicTranslations,
        status: "upcoming",
      });
    }
  }

  steps.push({
    time: 210,
    pourAmount: 0,
    cumulative: totalWater,
    descriptionKey: "finish",
    status: "upcoming",
  });
  return steps;
}

export function readBrewParameters(params: URLSearchParams): BrewParameters {
  const beans = Number(params.get("beans"));
  const flavor = params.get("flavor");
  const strength = params.get("strength");
  const roast = params.get("roast");
  return {
    beansAmount: Number.isInteger(beans) && beans >= 1 && beans <= 100
      ? beans
      : DEFAULT_PARAMETERS.beansAmount,
    flavor: flavor === "sweet" || flavor === "sour" || flavor === "middle"
      ? flavor
      : DEFAULT_PARAMETERS.flavor,
    strength: strength === "light" || strength === "strong" || strength === "medium"
      ? strength
      : DEFAULT_PARAMETERS.strength,
    roastLevel: roast === "light" || roast === "dark" || roast === "medium"
      ? roast
      : DEFAULT_PARAMETERS.roastLevel,
  };
}
