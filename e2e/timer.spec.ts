import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === baseURL) return route.continue();
    if (url.hostname === "daily-brew.takatama.workers.dev") {
      return route.fulfill({ json: { items: [{ id: "fixed-news", short_title: "Fresh coffee news", url: "https://example.com/news", source: "Test source" }] } });
    }
    return route.abort();
  });
  await page.addInitScript(() => {
    localStorage.setItem("46timer-settings", JSON.stringify({
      version: 6,
      state: { language: "en", notifyMode: "none", voice: "male", animation: true, debugEnabled: false, debugSpeed: 1 },
    }));
  });
  await page.clock.install({ time: new Date("2026-01-01T12:00:00Z") });
  await page.goto("/?beans=20&flavor=middle&strength=medium&roast=medium");
  await expect(page).toHaveURL(/\/en\/setup\?beans=20/);
  await page.clock.pauseAt(new Date("2026-01-01T12:01:00Z"));
});

const remaining = (page: Page) => page.getByRole("timer");

test("setup carries the 4:6 choices into a brew that reaches completion", async ({ page }) => {
  await page.getByRole("button", { name: "increase", exact: true }).click();
  await page.getByRole("button", { name: "Sour", exact: true }).click();
  await page.getByRole("button", { name: "Strong", exact: true }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.getByText("315g", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start Timer", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/timer\?beans=21.*flavor=sour.*strength=strong.*roast=dark/);
  await expect(page.getByText("Beans 21g", { exact: true })).toBeVisible();
  await expect(page.getByText("Water 315g", { exact: true })).toBeVisible();
  await expect(page.getByText("Temp 83℃", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Timeline" })).toBeVisible();
  await expect(page.getByText("First", { exact: true })).toBeVisible();

  await page.clock.runFor(6_000);
  const timeBeforeLanguageChange = (await remaining(page).innerText()).match(/\d+:\d{2}/)?.[0];
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("radio", { name: "日本語", exact: true }).click();
  await expect(page).toHaveURL(/\/ja\/timer\?/);
  expect((await remaining(page).innerText()).match(/\d+:\d{2}/)?.[0]).toBe(timeBeforeLanguageChange);
  await page.getByRole("radio", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();

  await page.clock.runFor(39_000);
  await expect(page.getByText("Next", { exact: true })).toBeVisible();
  await page.clock.fastForward("04:00");
  await expect(page.getByText("Enjoy your coffee", { exact: true })).toBeVisible();
  await expect(page.getByText("Fresh coffee news", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset", exact: true })).toHaveCount(0);
});

test("pause holds time, resume advances it, and confirmed reset returns to idle", async ({ page }) => {
  await page.getByRole("button", { name: "Start Timer", exact: true }).click();
  await page.clock.runFor(8_000);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await remaining(page).innerText();
  await page.clock.runFor(3_000);
  await expect(remaining(page)).toHaveText(paused);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(2_000);
  await expect(remaining(page)).not.toHaveText(paused);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Reset", exact: true }).click();
  await expect(remaining(page)).toHaveText("0:45 left");
});

test("canceling the startup countdown prevents a delayed start and allows retry", async ({ page }) => {
  await page.getByRole("button", { name: "Start Timer", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const idle = await remaining(page).innerText();
  await page.clock.runFor(8_000);
  await expect(remaining(page)).toHaveText(idle);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(8_000);
  await expect(remaining(page)).not.toHaveText(idle);
});
