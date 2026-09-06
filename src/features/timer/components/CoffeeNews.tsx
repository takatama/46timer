import { useTranslation } from "react-i18next";
import type { NewsItem } from "../hooks/useCoffeeNews";
import styles from "./CoffeeNews.module.css";

interface Props {
  news: NewsItem[];
  loading: boolean;
  failed: boolean;
}

export function CoffeeNews({ news, loading, failed }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="card-title">{t("news.title")}</div>
      {loading && <div className="hint">{t("news.loading")}</div>}
      {!loading && (failed || news.length === 0) && <div className="hint">{t("news.unavailable")}</div>}
      {!loading && news.length > 0 && (
        <ul className={styles.newsList}>
          {news.slice(0, 5).map((item) => (
            <li key={item.id}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.newsItem}>
                <span className={styles.newsItemTitle}>{item.short_title}</span>
                <span className={styles.newsItemSource}>{item.source}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
