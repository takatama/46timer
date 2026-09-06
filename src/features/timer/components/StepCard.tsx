import { Trans, useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import type { ComputedStep } from "../../recipe/types";
import { BrewStepCardFrame } from "../../../shared/brew-timer";
import { Countdown } from "./Countdown";
import { BrewTimeline } from "./BrewTimeline";
import styles from "./StepCard.module.css";

interface Props {
  step: ComputedStep;
  stepIndex: number;
  totalSteps: number;
  remainingSeconds: number;
  progress: number;
  isImminent: boolean;
  hideTargetAmount?: boolean;
  nextStepPreview?: ReactNode;
  steps: ComputedStep[];
  currentTime: number;
}

function VerbText({
  step,
}: {
  step: ComputedStep;
}) {
  const { t } = useTranslation();

  switch (step.actionType) {
    case "bloom":
      return <>{t("timer.bloom")}</>;
    case "pour":
      return <>{t("timer.pour")}</>;
    case "none":
      return <>{t("timer.finish")}</>;
    default:
      return <>{t("timer.wait")}</>;
  }
}

function InstructionText({
  step,
}: {
  step: ComputedStep;
}) {
  const { t } = useTranslation();

  if (step.actionType === "none") {
    return <>{t("timer.enjoyCoffee")}</>;
  }
  const amount = step.cumulative;
  if (step.actionType === "pour" || step.actionType === "bloom") {
    return (
      <Trans
        i18nKey="timer.pourToAmount"
        values={{ amount }}
        components={{ num: <span className="pour-number" />, unit: <span className="pour-unit" /> }}
      />
    );
  }

  return null;
}

export function StepCard({
  step,
  stepIndex,
  totalSteps,
  remainingSeconds,
  progress,
  isImminent,
  hideTargetAmount = false,
  nextStepPreview,
  steps,
  currentTime,
}: Props) {
  const { t } = useTranslation();
  return (
    <BrewStepCardFrame
      ariaLabel={t("timer.currentStep")}
      stepLabel={<>STEP {stepIndex + 1} / {totalSteps}</>}
      timeline={(
        <BrewTimeline
          steps={steps}
          currentStepIndex={stepIndex}
          currentTime={currentTime}
        />
      )}
      instruction={(
        <>
          <div className={styles.stepVerb}>
            <VerbText step={step} />
          </div>
          <div
            className={`${styles.stepSub}${hideTargetAmount ? ` ${styles.stepSubHidden}` : ""}`}
            aria-hidden={hideTargetAmount || undefined}
          >
            <InstructionText step={step} />
          </div>
        </>
      )}
      preview={nextStepPreview}
      countdown={(
        <Countdown
          remainingSeconds={remainingSeconds}
          progress={progress}
          isImminent={isImminent}
        />
      )}
      isImminent={isImminent}
    />
  );
}
