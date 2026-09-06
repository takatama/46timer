export const languages = ["ja", "en"] as const;
export type Language = (typeof languages)[number];
export const LANGUAGE_STORAGE_KEY = "46timer-language";

export function isLanguage(value: unknown): value is Language {
  return value === "ja" || value === "en";
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

export function languagePath(language: Language): string {
  return `/${language}/`;
}

export function resolveLanguageRoute(
  pathname: string,
  search: string,
  hash: string,
  preferredLanguage: Language,
): { language: Language; redirectTo: string | null } {
  const segments = pathname.split("/").filter(Boolean);
  const language = isLanguage(segments[0]) ? segments[0] : preferredLanguage;
  const canonicalPath = languagePath(language);
  return {
    language,
    redirectTo: pathname === canonicalPath ? null : `${canonicalPath}${search}${hash}`,
  };
}
