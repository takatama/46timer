import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCoffeeNews } from "./useCoffeeNews";

describe("useCoffeeNews", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reads and decodes the news JSON", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response(JSON.stringify({
      items: [{ id: "1", short_title: "Coffee &amp; Water", url: "https://example.com", source: "Daily &amp; Brew" }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }))));
    const { result } = renderHook(() => useCoffeeNews("en", true));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.failed).toBe(false);
    expect(result.current.news[0]?.short_title).toBe("Coffee & Water");
  });

  it("reports failure without throwing into the timer screen", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));
    const { result } = renderHook(() => useCoffeeNews("ja", true));
    await waitFor(() => expect(result.current.failed).toBe(true));
    expect(result.current.news).toEqual([]);
  });
});
