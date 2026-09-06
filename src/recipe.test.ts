import { describe, expect, it } from "vitest";
import { calculateSteps, getWaterTemperature, readBrewParameters } from "./recipe";

describe("4:6 recipe", () => {
  it("keeps the sweet flavor split and medium-strength timing", () => {
    const steps = calculateSteps(20, "sweet", "medium");
    expect(steps.map((step) => step.time)).toEqual([0, 45, 90, 150, 210]);
    expect(steps.map((step) => step.cumulative)).toEqual([48, 120, 210, 300, 300]);
  });

  it("uses one strength pour for light and three for strong", () => {
    expect(calculateSteps(20, "middle", "light").map((step) => step.time)).toEqual([0, 45, 90, 210]);
    expect(calculateSteps(20, "middle", "strong").map((step) => step.time)).toEqual([0, 45, 90, 130, 170, 210]);
  });

  it("keeps roast temperatures", () => {
    expect(getWaterTemperature("light")).toBe(93);
    expect(getWaterTemperature("medium")).toBe(88);
    expect(getWaterTemperature("dark")).toBe(83);
  });

  it("accepts valid shared parameters and rejects unsafe values", () => {
    expect(readBrewParameters(new URLSearchParams("beans=25&flavor=sour&strength=strong&roast=dark"))).toEqual({ beansAmount: 25, flavor: "sour", strength: "strong", roastLevel: "dark" });
    expect(readBrewParameters(new URLSearchParams("beans=-1&flavor=nope&strength=nope&roast=nope"))).toEqual({ beansAmount: 20, flavor: "middle", strength: "medium", roastLevel: "medium" });
  });
});
