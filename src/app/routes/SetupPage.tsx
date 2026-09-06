import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { computeSteps, getTotalWater, getWaterTemperature } from "../../features/recipe";
import type { FlavorProfile, RoastLevel, StrengthProfile } from "../../features/recipe";
import { useSessionStore } from "../../features/timer/store";
import { useDisplayLanguage } from "../../shared/i18n/DisplayLanguage";
import { localizedPath } from "../../shared/i18n/routing";
import styles from "./SetupPage.module.css";

const flavors: FlavorProfile[] = ["sweet", "neutral", "sour"];
const strengths: StrengthProfile[] = ["light", "medium", "strong"];
const roasts: RoastLevel[] = ["light", "medium", "dark"];

function isOneOf<T extends string>(value: string | null, options: readonly T[]): value is T {
  return value !== null && options.includes(value as T);
}

export function SetupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const displayLanguage = useDisplayLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { beans, flavor, strength, roast, setBeans, setFlavor, setStrength, setRoast } = useSessionStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const parsedBeans = Number(searchParams.get("beans"));
    if (Number.isInteger(parsedBeans) && parsedBeans >= 1 && parsedBeans <= 100) setBeans(parsedBeans);
    const parsedFlavor = searchParams.get("flavor");
    if (isOneOf(parsedFlavor, ["sweet", "middle", "neutral", "sour"] as const)) {
      setFlavor(parsedFlavor === "middle" ? "neutral" : parsedFlavor);
    }
    const parsedStrength = searchParams.get("strength");
    if (isOneOf(parsedStrength, strengths)) setStrength(parsedStrength);
    const parsedRoast = searchParams.get("roast");
    if (isOneOf(parsedRoast, roasts)) setRoast(parsedRoast);
    setHydrated(true);
    // URL parameters are read once so in-page updates cannot overwrite active input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const next = new URLSearchParams(searchParams);
    next.set("beans", String(beans));
    next.set("flavor", flavor === "neutral" ? "middle" : flavor);
    next.set("strength", strength);
    next.set("roast", roast);
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [beans, flavor, hydrated, roast, searchParams, setSearchParams, strength]);

  const totalWater = getTotalWater(beans);
  const steps = useMemo(() => computeSteps(beans, flavor, strength), [beans, flavor, strength]);
  const temperature = getWaterTemperature(roast);

  const handleStart = () => {
    const next = new URLSearchParams(searchParams);
    next.set("autostart", "1");
    navigate(localizedPath(displayLanguage, "timer", `?${next.toString()}`, location.hash));
  };

  return (
    <main className="content">
      <section className="card">
        <div className={styles.stepperRow}>
          <span className={styles.beansLabel}>{t("setup.beans")}</span>
          <div className={styles.stepperControls}>
            <button className={styles.btnIcon} onClick={() => setBeans(beans - 1)} aria-label="decrease">−</button>
            <div className={styles.beansValue}>{beans}g</div>
            <button className={styles.btnIcon} onClick={() => setBeans(beans + 1)} aria-label="increase">＋</button>
          </div>
        </div>
        <div className={styles.calculatedWater}>
          <span className={styles.calculatedWaterLabel}>{t("setup.water")}</span>
          <span className={styles.calculatedWaterValue}>{totalWater}g</span>
          <span className={styles.waterRatio}>1:15</span>
        </div>

        <div className={styles.optionGroup}>
          <div className={styles.optionLabel}>{t("setup.flavor")}</div>
          <div className="choice-row">
            {flavors.map((value) => (
              <button key={value} className={`choice${flavor === value ? " active" : ""}`} onClick={() => setFlavor(value)}>
                {t(`setup.${value}`)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionGroup}>
          <div className={styles.optionLabel}>{t("setup.strength")}</div>
          <div className="choice-row">
            {strengths.map((value) => (
              <button key={value} className={`choice${strength === value ? " active" : ""}`} onClick={() => setStrength(value)}>
                {t(`setup.strength${value[0].toUpperCase()}${value.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionGroup}>
          <div className={styles.optionLabel}>{t("setup.roast")}</div>
          <div className="choice-row">
            {roasts.map((value) => (
              <button key={value} className={`choice${roast === value ? " active" : ""}`} onClick={() => setRoast(value)}>
                {t(`setup.roast${value[0].toUpperCase()}${value.slice(1)}`)}
              </button>
            ))}
          </div>
          <div className={styles.temperature}>{t("setup.temperature")} <strong>{temperature}℃</strong></div>
        </div>
      </section>

      <button className={styles.btnPrimary} onClick={handleStart}>{t("setup.start")}</button>

      <details className="card" open={detailsOpen} onToggle={(event) => setDetailsOpen((event.target as HTMLDetailsElement).open)}>
        <summary className={styles.detailsSummary}>
          <span>{t("setup.details")}</span>
          <span className={styles.detailsSummaryLink}>{detailsOpen ? t("setup.closeAction") : t("setup.detailsAction")}</span>
        </summary>
        <div className={styles.detailsBody}>
          <div className={styles.detailsText}>{t("intro.description")}</div>
          <div>
            <div className={styles.detailsSubTitle}>{t("setup.steps")}</div>
            <div className={styles.stepList}>
              {steps.slice(0, -1).map((step, index) => (
                <div key={`${step.timeSec}-${step.cumulative}`} className={styles.stepItem}>
                  <span className={styles.stepNumber}>STEP {index + 1}</span>
                  <span className={styles.stepInstruction}>{t(index === 0 ? "setup.stepBloom" : "setup.stepPourTo", { amount: step.cumulative })}</span>
                  <span className={styles.stepDuration}>{t("setup.stepDuration", { seconds: steps[index + 1].timeSec - step.timeSec })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </main>
  );
}
