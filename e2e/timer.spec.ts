import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("46timer-language", "en"));
  await page.clock.install({ time: new Date("2026-01-01T12:00:00Z") });
  await page.goto("/?beans=20&flavor=middle&strength=medium&roast=medium");
  await expect(page).toHaveURL(/\/en\/\?beans=20/);
  await page.clock.pauseAt(new Date("2026-01-01T12:01:00Z"));
});

const timer = (page: Page) => page.getByRole("timer");

test("settings feed the integrated card and the brew reaches completion", async ({ page }) => {
  await page.getByRole("button", { name: "increase" }).click();
  const card = page.getByRole("region", { name: "Current step" });
  await expect(card.getByText("Beans 21g", { exact: true })).toBeVisible();
  await expect(card.getByText("Water 315g", { exact: true })).toBeVisible();
  await expect(card.getByRole("img", { name: "Timeline" })).toHaveCount(1);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(card.getByRole("status", { name: "First" })).toBeVisible();
  await page.clock.runFor(6_000);
  const beforeLanguage = (await timer(page).innerText()).match(/\d+:\d{2}/)?.[0];
  await page.getByRole("button", { name: "JA", exact: true }).click();
  await expect(page).toHaveURL(/\/ja\/\?beans=21/);
  expect((await timer(page).innerText()).match(/\d+:\d{2}/)?.[0]).toBe(beforeLanguage);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await page.clock.runFor(39_000);
  await expect(card.getByRole("status", { name: "Next" })).toBeVisible();
  await page.clock.fastForward("03:35");
  await expect(page.getByText("Enjoy your coffee", { exact: true })).toBeVisible();
});

test("pause holds time, resume advances it, and reset returns to idle", async ({ page }) => {
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(8_000);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await timer(page).innerText();
  await page.clock.runFor(3_000);
  await expect(timer(page)).toHaveText(paused);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(2_000);
  await expect(timer(page)).not.toHaveText(paused);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(timer(page)).toHaveText("0:45");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
});

test("canceling startup prevents a delayed start and allows retry", async ({ page }) => {
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.clock.runFor(8_000);
  await expect(timer(page)).toHaveText("0:45");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(8_000);
  await expect(timer(page)).not.toHaveText("0:45");
});
