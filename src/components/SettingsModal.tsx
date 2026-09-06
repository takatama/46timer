import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Voice } from "../hooks/useAudioGuidance";
import type { Language } from "../routing";
import type { TranslationType } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  t: TranslationType;
  language: Language;
  onLanguageChange: (language: Language) => void;
  soundOn: boolean;
  setSoundOn: (value: boolean) => void;
  vibrationOn: boolean;
  setVibrationOn: (value: boolean) => void;
  voice: Voice;
  setVoice: (voice: Voice) => void;
  animationOn: boolean;
  setAnimationOn: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function SettingsModal(props: Props) {
  const { open, onClose, t, language, onLanguageChange, soundOn, setSoundOn, vibrationOn, setVibrationOn, voice, setVoice, animationOn, setAnimationOn, darkMode, setDarkMode } = props;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t.settings}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.25} pt={0.5}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{t.language}</Typography>
            <ToggleButtonGroup value={language} exclusive fullWidth onChange={(_, value: Language | null) => value && onLanguageChange(value)} size="small" aria-label={t.language}>
              <ToggleButton value="ja">日本語</ToggleButton>
              <ToggleButton value="en">English</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="subtitle2">{t.notification}</Typography>
            <FormControlLabel control={<Switch checked={soundOn} onChange={(_, checked) => setSoundOn(checked)} />} label={t.sound} />
            <ToggleButtonGroup value={voice} exclusive fullWidth disabled={!soundOn} onChange={(_, value: Voice | null) => value && setVoice(value)} size="small" aria-label={t.voice}>
              <ToggleButton value="female">{t.female}</ToggleButton>
              <ToggleButton value="male">{t.male}</ToggleButton>
            </ToggleButtonGroup>
            <FormControlLabel control={<Switch checked={vibrationOn} onChange={(_, checked) => setVibrationOn(checked)} />} label={t.vibration} />
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="subtitle2">{t.display}</Typography>
            <FormControlLabel control={<Switch checked={animationOn} onChange={(_, checked) => setAnimationOn(checked)} />} label={t.animation} />
            <FormControlLabel control={<Switch checked={darkMode} onChange={(_, checked) => setDarkMode(checked)} />} label={t.darkMode} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>{t.close}</Button></DialogActions>
    </Dialog>
  );
}
