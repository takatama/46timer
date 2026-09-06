import { create } from "zustand";
import type { FlavorProfile, RoastLevel, StrengthProfile } from "../recipe/types";

interface SessionStore {
  beans: number;
  flavor: FlavorProfile;
  strength: StrengthProfile;
  roast: RoastLevel;
  setBeans: (beans: number) => void;
  setFlavor: (flavor: FlavorProfile) => void;
  setStrength: (strength: StrengthProfile) => void;
  setRoast: (roast: RoastLevel) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  beans: 20,
  flavor: "neutral",
  strength: "medium",
  roast: "medium",
  setBeans: (beans) => set({ beans: Math.min(100, Math.max(1, Math.round(beans))) }),
  setFlavor: (flavor) => set({ flavor }),
  setStrength: (strength) => set({ strength }),
  setRoast: (roast) => set({ roast }),
}));
