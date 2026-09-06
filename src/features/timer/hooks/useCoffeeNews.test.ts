import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCoffeeNews } from "./useCoffeeNews";

describe("useCoffeeNews", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("loads and decodes language-specific news", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ id: "1", short_title: "Coffee &amp; tea", url: "https://example.com", source: "Daily &amp; Brew" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useCoffeeNews("en", true));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledWith("https://daily-brew.takatama.workers.dev/news?lang=en", expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(result.current.news[0]).toMatchObject({ short_title: "Coffee & tea", source: "Daily & Brew" });
    expect(result.current.failed).toBe(false);
  });

  it("keeps the completion screen usable when the service fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const { result } = renderHook(() => useCoffeeNews("ja", true));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.news).toEqual([]);
    expect(result.current.failed).toBe(true);
  });
});
