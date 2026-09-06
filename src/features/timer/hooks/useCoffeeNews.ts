import { useEffect, useState } from "react";
import type { Language } from "../../settings/types";

export interface NewsItem {
  id: string;
  short_title: string;
  url: string;
  source: string;
}

function decodeHtml(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

export function useCoffeeNews(language: Language, enabled = true) {
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
    fetch(`https://daily-brew.takatama.workers.dev/news?lang=${language}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`News request failed: ${response.status}`);
        return response.json() as Promise<{ items?: unknown }>;
      })
      .then((data) => {
        const items = (Array.isArray(data.items) ? data.items : []).flatMap((item): NewsItem[] => {
          if (!item || typeof item !== "object") return [];
          const candidate = item as Partial<NewsItem>;
          if (typeof candidate.id !== "string" || typeof candidate.short_title !== "string" || typeof candidate.url !== "string" || typeof candidate.source !== "string") return [];
          return [{ id: candidate.id, short_title: decodeHtml(candidate.short_title), url: candidate.url, source: decodeHtml(candidate.source) }];
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
  }, [language, enabled]);

  return { news, loading, failed };
}
