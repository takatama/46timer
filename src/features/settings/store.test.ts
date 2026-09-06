import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage before importing the store
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

const { migrateLegacySettings, useSettingsStore } = await import("./store");

describe("useSettingsStore", () => {
  beforeEach(() => {
    localStorageMock.clear();
    useSettingsStore.setState({
      language: "en",
      notifyMode: "both",
      voice: "male",
      debugEnabled: false,
      debugSpeed: 1,
      animation: true,
    });
  });

  it("has correct defaults", () => {
    const state = useSettingsStore.getState();
    expect(state.notifyMode).toBe("both");
    expect(state.voice).toBe("male");
    expect(state.debugEnabled).toBe(false);
    expect(state.debugSpeed).toBe(1);
    expect(state.animation).toBe(true);
  });

  it("setLanguage updates language", () => {
    useSettingsStore.getState().setLanguage("ja");
    expect(useSettingsStore.getState().language).toBe("ja");
  });

  it("toggleNotifyFlag: sound off from both → vibrate", () => {
    useSettingsStore.getState().toggleNotifyFlag("sound");
    expect(useSettingsStore.getState().notifyMode).toBe("vibrate");
  });

  it("toggleNotifyFlag: vibrate off from both → sound", () => {
    useSettingsStore.getState().toggleNotifyFlag("vibrate");
    expect(useSettingsStore.getState().notifyMode).toBe("sound");
  });

  it("toggleNotifyFlag: both off → none", () => {
    useSettingsStore.getState().toggleNotifyFlag("sound");
    useSettingsStore.getState().toggleNotifyFlag("vibrate");
    expect(useSettingsStore.getState().notifyMode).toBe("none");
  });

  it("toggleNotifyFlag: from none, toggle sound → sound", () => {
    useSettingsStore.setState({ notifyMode: "none" });
    useSettingsStore.getState().toggleNotifyFlag("sound");
    expect(useSettingsStore.getState().notifyMode).toBe("sound");
  });

  it("isSoundEnabled reflects notifyMode", () => {
    expect(useSettingsStore.getState().isSoundEnabled()).toBe(true);
    useSettingsStore.setState({ notifyMode: "vibrate" });
    expect(useSettingsStore.getState().isSoundEnabled()).toBe(false);
    useSettingsStore.setState({ notifyMode: "sound" });
    expect(useSettingsStore.getState().isSoundEnabled()).toBe(true);
  });

  it("isVibrateEnabled reflects notifyMode", () => {
    expect(useSettingsStore.getState().isVibrateEnabled()).toBe(true);
    useSettingsStore.setState({ notifyMode: "sound" });
    expect(useSettingsStore.getState().isVibrateEnabled()).toBe(false);
  });

  it("setVoice updates voice", () => {
    useSettingsStore.getState().setVoice("female");
    expect(useSettingsStore.getState().voice).toBe("female");
  });

  it("setDebugSpeed updates speed without disabling debug mode", () => {
    useSettingsStore.getState().setDebugEnabled(true);

    useSettingsStore.getState().setDebugSpeed(5);
    expect(useSettingsStore.getState().debugSpeed).toBe(5);
    expect(useSettingsStore.getState().debugEnabled).toBe(true);

    useSettingsStore.getState().setDebugSpeed(1);
    expect(useSettingsStore.getState().debugSpeed).toBe(1);
    expect(useSettingsStore.getState().debugEnabled).toBe(true);
  });

  it("setDebugEnabled toggles debug mode and syncs speed", () => {
    useSettingsStore.getState().setDebugEnabled(true);
    expect(useSettingsStore.getState().debugEnabled).toBe(true);
    expect(useSettingsStore.getState().debugSpeed).toBe(5);

    useSettingsStore.getState().setDebugEnabled(false);
    expect(useSettingsStore.getState().debugEnabled).toBe(false);
    expect(useSettingsStore.getState().debugSpeed).toBe(1);
  });

  it("setAnimation updates animation", () => {
    useSettingsStore.getState().setAnimation(false);
    expect(useSettingsStore.getState().animation).toBe(false);
  });

  it("migrates the settings saved by the previous 46timer", () => {
    localStorage.setItem("46timer-language", "ja");
    localStorage.setItem("46timer-settings", JSON.stringify({
      soundOn: true,
      vibrationOn: false,
      voice: "female",
      animationOn: false,
      darkMode: true,
    }));
    migrateLegacySettings();
    const migrated = JSON.parse(localStorage.getItem("46timer-settings") ?? "{}") as { state?: Record<string, unknown> };
    expect(migrated.state).toMatchObject({ language: "ja", notifyMode: "sound", voice: "female", animation: false });
  });

});
