import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import { Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { formatTimerTime, type TimerStatus } from "../shared/brew-timer";
import type { Step, TranslationType } from "../types";

interface Props {
  t: TranslationType;
  steps: Step[];
  currentTime: number;
  currentStepIndex: number;
  status: TimerStatus;
  isStarting: boolean;
  isRunningOrStarting: boolean;
  previewStepIndex: number | null;
  beansAmount: number;
  totalWater: number;
  temperature: number;
  onToggle: () => void;
  onReset: () => void;
}

function Timeline({ steps, currentTime, currentStepIndex, label }: { steps: Step[]; currentTime: number; currentStepIndex: number; label: string }) {
  const totalTime = steps[steps.length - 1]?.time ?? 0;
  const elapsed = totalTime ? Math.min(100, (currentTime / totalTime) * 100) : 0;
  return (
    <Box role="img" aria-label={label} sx={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 1.25, alignItems: "center" }}>
      <Typography variant="caption" color="text.secondary">0:00</Typography>
      <Box sx={{ position: "relative", height: 20 }}>
        <Box sx={{ position: "absolute", inset: "8px 0 auto", height: 4, bgcolor: "action.disabledBackground", borderRadius: 8 }} />
        <Box sx={{ position: "absolute", top: 8, left: 0, width: `${elapsed}%`, height: 4, bgcolor: "primary.main", borderRadius: 8 }} />
        {steps.map((step, index) => (
          <Box key={`${step.time}-${index}`} sx={{ position: "absolute", top: index === currentStepIndex ? 5 : 6, left: `${totalTime ? (step.time / totalTime) * 100 : 0}%`, width: index === currentStepIndex ? 10 : 8, height: index === currentStepIndex ? 10 : 8, bgcolor: index <= currentStepIndex ? "primary.main" : "background.paper", border: "2px solid", borderColor: "primary.main", borderRadius: "50%", transform: "translateX(-50%)" }} />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">{formatTimerTime(totalTime)}</Typography>
    </Box>
  );
}

export function BrewCard(props: Props) {
  const { t, steps, currentTime, currentStepIndex, status, isStarting, isRunningOrStarting, previewStepIndex, beansAmount, totalWater, temperature, onToggle, onReset } = props;
  const currentStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];
  const previewStep = previewStepIndex === null ? null : steps[previewStepIndex];
  const pourSteps = steps.length - 1;
  const remaining = nextStep ? Math.max(0, nextStep.time - currentTime) : Math.max(0, (steps[steps.length - 1]?.time ?? 0) - currentTime);
  const stepStart = currentStep?.time ?? 0;
  const stepEnd = nextStep?.time ?? steps[steps.length - 1]?.time ?? 1;
  const progress = Math.min(100, Math.max(0, ((currentTime - stepStart) / Math.max(1, stepEnd - stepStart)) * 100));
  const instruction = currentStep ? t[currentStep.descriptionKey](Math.round(currentStep.cumulative)) : t.ready;
  const previewInstruction = previewStep ? t[previewStep.descriptionKey](Math.round(previewStep.cumulative)) : "";
  const isFinished = status === "finished";

  return (
    <Paper component="section" aria-label={t.currentStep} elevation={4} sx={{ borderRadius: 4, p: { xs: 2, sm: 3 }, mb: 2.5, border: "2px solid", borderColor: "primary.main", overflow: "hidden" }}>
      <Stack direction="row" gap={1} flexWrap="wrap" mb={1.5}>
        <Chip size="small" label={`${t.beansAmount} ${beansAmount}g`} />
        <Chip size="small" label={`${t.waterVolume} ${totalWater}g`} />
        <Chip size="small" label={`${t.waterTemp} ${temperature}℃`} />
      </Stack>
      <Typography variant="caption" color="text.secondary">{isFinished ? t.completeMessage : `${t.currentStep} ${Math.min(currentStepIndex + 1, pourSteps)} / ${pourSteps}`}</Typography>
      <Timeline steps={steps} currentTime={currentTime} currentStepIndex={currentStepIndex} label={t.timeline} />
      <Box sx={{ minHeight: 210, display: "grid", placeItems: "center", py: 1.5 }}>
        {previewStep ? (
          <Stack role="status" aria-label={previewStepIndex === 0 ? t.firstStep : t.nextStep} alignItems="center" spacing={1} textAlign="center">
            <Typography variant="overline" color="primary">{previewStepIndex === 0 ? t.firstStep : t.nextStep}</Typography>
            <Box className="pour-animation" aria-hidden="true"><span className="pour-stream" /><span className="pour-cup" /></Box>
            <Typography variant="h5" fontWeight={800} sx={{ overflowWrap: "anywhere" }}>{previewInstruction}</Typography>
            <Typography color="text.secondary">{t.addWater} +{Math.round(previewStep.pourAmount)}g</Typography>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={1} textAlign="center">
            <Typography variant="h4" fontWeight={800} sx={{ overflowWrap: "anywhere" }}>{isFinished ? t.finish() : instruction}</Typography>
            {!isFinished && currentStep && <Typography color="text.secondary">{t.addWater} +{Math.round(currentStep.pourAmount)}g</Typography>}
            <Typography role="timer" variant="h3" fontWeight={700} sx={{ fontVariantNumeric: "tabular-nums" }}>{formatTimerTime(remaining)}</Typography>
            {!isFinished && <Typography variant="caption" color="text.secondary">{t.remaining}</Typography>}
          </Stack>
        )}
      </Box>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 7, borderRadius: 8, mb: 2 }} />
      <Stack direction="row" justifyContent="center" spacing={1.5}>
        {!isFinished && <Button variant="contained" size="large" startIcon={isRunningOrStarting ? <PauseIcon /> : <PlayArrowIcon />} onClick={onToggle}>{isRunningOrStarting ? t.pause : t.play}</Button>}
        {(currentTime > 0 || isStarting || isFinished) && <Button variant="outlined" size="large" startIcon={<ReplayIcon />} onClick={onReset}>{t.reset}</Button>}
      </Stack>
    </Paper>
  );
}
