export const languages = ["ja", "en"] as const;
export type Language = (typeof languages)[number];
export const appPages = ["setup", "timer"] as const;
export type AppPage = (typeof appPages)[number];
export const LANGUAGE_STORAGE_KEY = "46timer-language";

export function isLanguage(value: unknown): value is Language {
  return value === "ja" || value === "en";
}

export function isAppPage(value: unknown): value is AppPage {
  return value === "setup" || value === "timer";
}

export function getSavedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function choosePreferredLanguage(
  savedLanguage: unknown,
  browserLanguage: string | undefined,
): Language {
  if (isLanguage(savedLanguage)) return savedLanguage;
  return browserLanguage?.toLowerCase().startsWith("ja") ? "ja" : "en";
}

export function languagePath(language: Language, page: AppPage): string {
  return `/${language}/${page}`;
}

export function resolveLanguageRoute(
  pathname: string,
  search: string,
  hash: string,
  preferredLanguage: Language,
): { language: Language; page: AppPage; redirectTo: string | null } {
  const segments = pathname.split("/").filter(Boolean);
  const language = isLanguage(segments[0]) ? segments[0] : preferredLanguage;
  const page = isLanguage(segments[0]) && isAppPage(segments[1])
    ? segments[1]
    : isAppPage(segments[0])
      ? segments[0]
      : isAppPage(segments[1])
        ? segments[1]
        : "setup";
  const canonicalPath = languagePath(language, page);
  return {
    language,
    page,
    redirectTo: pathname === canonicalPath ? null : `${canonicalPath}${search}${hash}`,
  };
}
