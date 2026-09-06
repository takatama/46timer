import { describe, expect, it } from "vitest";
import { choosePreferredLanguage, resolveLanguageRoute } from "./routing";

describe("language routes", () => {
  it("uses saved language, then Japanese browser language, then English", () => {
    expect(choosePreferredLanguage("en", "ja-JP")).toBe("en");
    expect(choosePreferredLanguage(null, "ja-JP")).toBe("ja");
    expect(choosePreferredLanguage("invalid", "fr-FR")).toBe("en");
  });

  it("keeps a canonical shared URL without changing the preference", () => {
    expect(resolveLanguageRoute("/ja/timer", "?beans=25", "#brew", "en")).toEqual({ language: "ja", page: "timer", redirectTo: null });
  });

  it("safely normalizes old and unsupported paths while preserving query and hash", () => {
    expect(resolveLanguageRoute("/", "?beans=25", "#brew", "ja").redirectTo).toBe("/ja/setup?beans=25#brew");
    expect(resolveLanguageRoute("/fr/timer", "?beans=20", "", "en").redirectTo).toBe("/en/timer?beans=20");
    expect(resolveLanguageRoute("/en/", "", "", "ja").redirectTo).toBe("/en/setup");
  });
});
