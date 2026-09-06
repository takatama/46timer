import { useEffect, useState } from "react";
import type { Language } from "../routing";

export const NEWS_API_URL = "https://daily-brew.takatama.workers.dev/news";

export interface NewsItem {
  id: string;
  short_title: string;
  url: string;
  source: string;
}

function decodeHtml(value: string): string {
  const element = document.createElement("textarea");
  element.innerHTML = value;
  return element.value;
}

export function useCoffeeNews(language: Language, enabled: boolean) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setNews([]);
      setLoading(false);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    fetch(`${NEWS_API_URL}?lang=${language}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`News request failed: ${response.status}`);
        return response.json() as Promise<{ items?: unknown }>;
      })
      .then((data) => {
        const rawItems = Array.isArray(data.items) ? data.items : [];
        const items = rawItems.flatMap((item): NewsItem[] => {
          if (!item || typeof item !== "object") return [];
          const candidate = item as Partial<NewsItem>;
          if (typeof candidate.id !== "string" || typeof candidate.short_title !== "string" || typeof candidate.url !== "string" || typeof candidate.source !== "string") return [];
          return [{ ...candidate as NewsItem, short_title: decodeHtml(candidate.short_title), source: decodeHtml(candidate.source) }];
        });
        setNews(items);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setNews([]);
        setFailed(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [enabled, language]);

  return { news, loading, failed };
}
