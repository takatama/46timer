import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTimerOrchestrator } from "../../features/timer/hooks/useTimerOrchestrator";
import { useSettingsStore } from "../../features/settings/store";
import { StepCard } from "../../features/timer/components/StepCard";
import { FinishCard } from "../../features/timer/components/FinishCard";
import { NextStepPreview } from "../../features/timer/components/NextStepPreview";
import { useCoffeeNews } from "../../features/timer/hooks/useCoffeeNews";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { useDisplayLanguage } from "../../shared/i18n/DisplayLanguage";
import { localizedPath } from "../../shared/i18n/routing";
import styles from "./TimerPage.module.css";
import { useSessionStore } from "../../features/timer/store";

export function TimerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialParams = useRef(new URLSearchParams(searchParams));
  const session = useSessionStore();
  const displayLanguage = useDisplayLanguage();

  useEffect(() => {
    const params = initialParams.current;
    const parsedBeans = Number(params.get("beans"));
    if (Number.isInteger(parsedBeans) && parsedBeans >= 1 && parsedBeans <= 100) session.setBeans(parsedBeans);
    const flavor = params.get("flavor");
    if (flavor === "sweet" || flavor === "sour" || flavor === "neutral" || flavor === "middle") session.setFlavor(flavor === "middle" ? "neutral" : flavor);
    const strength = params.get("strength");
    if (strength === "light" || strength === "medium" || strength === "strong") session.setStrength(strength);
    const roast = params.get("roast");
    if (roast === "light" || roast === "medium" || roast === "dark") session.setRoast(roast);
    // Shared URL parameters hydrate the session only when the timer page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    steps,
    beans,
    flavor,
    strength,
    totalWater,
    temperature,
    currentStep,
    timer,
    overlayStep,
    remainingToNext,
    progress,
    isImminent,
    isRunningOrStarting,
    animation,
    handlePlayPause,
    handleReset,
  } = useTimerOrchestrator();

  const isFinishStep = currentStep?.actionType === "none";
  useEffect(() => {
    if (isFinishStep) window.scrollTo({ top: 0, left: 0 });
  }, [isFinishStep]);
  const brewStepCount = steps.filter((step) => step.actionType !== "none").length;
  const { debugEnabled, debugSpeed, setDebugSpeed } = useSettingsStore();
  const { news, loading: newsLoading, failed: newsFailed } = useCoffeeNews(displayLanguage, isFinishStep);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetTimer = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    setResetDialogOpen(false);
    handleReset();
  };

  return (
    <main className="content">
      <section className="card">
        <div className={styles.chipRow}>
          <span className={styles.chip}>
            {t("timer.beansChipLabel")} <span className={styles.chipValue}>{beans}g</span>
          </span>
          <span className={styles.chip}>
            {t("timer.waterChipLabel")} <span className={styles.chipValue}>{totalWater}g</span>
          </span>
          <span className={styles.chip}>
            {t("timer.flavorLabel")} <span className={styles.chipValue}>{t(`setup.${flavor}`)}</span>
          </span>
          <span className={styles.chip}>
            {t("timer.strengthLabel")} <span className={styles.chipValue}>{t(`setup.strength${strength[0].toUpperCase()}${strength.slice(1)}`)}</span>
          </span>
          <span className={styles.chip}>
            {t("timer.temperatureLabel")} <span className={styles.chipValue}>{temperature}℃</span>
          </span>
        </div>
        <button className={styles.textLink} onClick={() => navigate(localizedPath(displayLanguage, "setup", location.search, location.hash))}>
          {t("timer.editParams")}
        </button>
      </section>

      {currentStep && currentStep.actionType !== "none" && (
        <StepCard
          step={currentStep}
          stepIndex={timer.currentStepIndex}
          totalSteps={brewStepCount}
          remainingSeconds={remainingToNext}
          progress={progress}
          isImminent={isImminent}
          hideTargetAmount={
            timer.status === "idle" &&
            timer.currentStepIndex === 0 &&
            timer.currentTime === 0
          }
          nextStepPreview={
            overlayStep && animation && steps[overlayStep.index] ? (
              <NextStepPreview
                step={steps[overlayStep.index]}
                prevCumulative={overlayStep.prevCumulative}
                visible={true}
                isFirstStep={overlayStep.index === 0}
              />
            ) : undefined
          }
          steps={steps}
          currentTime={timer.currentTime}
        />
      )}

      {currentStep?.actionType === "none" && (
        <FinishCard
          news={news}
          newsLoading={newsLoading}
          newsFailed={newsFailed}
        />
      )}

      <section className={styles.controls}>
        {!isFinishStep && (
          <div className={styles.primaryControlRow}>
            <button className={`${styles.btn} ${styles.primary}`} onClick={handlePlayPause}>
              {isRunningOrStarting ? t("timer.pause") : t("timer.play")}
            </button>
            {debugEnabled && (
              <button
                className={`${styles.speedToggle} ${debugSpeed === 5 ? styles.speedToggleActive : ""}`}
                onClick={() => setDebugSpeed(debugSpeed === 5 ? 1 : 5)}
              >
                {t("settings.debugX5")}
              </button>
            )}
          </div>
        )}
        {!isFinishStep && (
          <button className={`${styles.btn} ${styles.outline}`} onClick={handleResetTimer}>
            {t("timer.reset")}
          </button>
        )}
      </section>

      <ConfirmDialog
        open={resetDialogOpen}
        title={t("timer.reset")}
        message={t("timer.resetConfirm")}
        confirmLabel={t("timer.resetConfirmAction")}
        cancelLabel={t("timer.resetCancelAction")}
        onConfirm={handleResetConfirm}
        onCancel={() => setResetDialogOpen(false)}
      />
    </main>
  );
}
