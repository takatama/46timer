import { describe, expect, it } from "vitest";
import { computeSteps, formatTime, getCurrentStepIndex, getTotalWater, getWaterTemperature } from "./waterCalc";

describe("4:6 recipe", () => {
  it("uses a 1:15 bean-to-water ratio", () => {
    expect(getTotalWater(20)).toBe(300);
    expect(getTotalWater(21)).toBe(315);
  });

  it("splits the first 40% according to flavor", () => {
    expect(computeSteps(20, "sweet", "medium").slice(0, 2).map((step) => step.increment)).toEqual([48, 72]);
    expect(computeSteps(20, "neutral", "medium").slice(0, 2).map((step) => step.increment)).toEqual([60, 60]);
    expect(computeSteps(20, "sour", "medium").slice(0, 2).map((step) => step.increment)).toEqual([72, 48]);
  });

  it("uses one, two, or three pours for the remaining 60%", () => {
    expect(computeSteps(20, "neutral", "light").map((step) => step.timeSec)).toEqual([0, 45, 90, 210]);
    expect(computeSteps(20, "neutral", "medium").map((step) => step.timeSec)).toEqual([0, 45, 90, 150, 210]);
    expect(computeSteps(20, "neutral", "strong").map((step) => step.timeSec)).toEqual([0, 45, 90, 130, 170, 210]);
  });

  it("rounds individual pours while preserving the exact final water amount", () => {
    const steps = computeSteps(21, "sweet", "strong");
    expect(steps[steps.length - 1]?.cumulative).toBe(315);
    expect(steps.slice(0, -1).every((step) => Number.isInteger(step.increment))).toBe(true);
  });

  it("keeps the original roast temperatures", () => {
    expect(getWaterTemperature("light")).toBe(93);
    expect(getWaterTemperature("medium")).toBe(88);
    expect(getWaterTemperature("dark")).toBe(83);
  });

  it("keeps timer helpers", () => {
    const steps = computeSteps(20, "neutral", "medium");
    expect(getCurrentStepIndex(steps, 150)).toBe(3);
    expect(formatTime(210)).toBe("3:30");
  });
});
