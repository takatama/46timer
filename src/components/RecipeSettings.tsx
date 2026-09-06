import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, Button, Card, CardContent, FormControlLabel, Stack, Switch, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { Flavor, RoastLevel, Strength } from "../recipe";
import type { TranslationType } from "../types";
import type { Voice } from "../hooks/useAudioGuidance";

interface Props {
  t: TranslationType;
  beansAmount: number;
  setBeansAmount: (amount: number) => void;
  roastLevel: RoastLevel;
  setRoastLevel: (value: RoastLevel) => void;
  flavor: Flavor;
  setFlavor: (value: Flavor) => void;
  strength: Strength;
  setStrength: (value: Strength) => void;
  waterTemperature: number;
  soundOn: boolean;
  setSoundOn: (value: boolean) => void;
  vibrationOn: boolean;
  setVibrationOn: (value: boolean) => void;
  voice: Voice;
  setVoice: (value: Voice) => void;
  disabled: boolean;
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "110px 1fr" }, gap: 1, alignItems: "center" }}>
      <Typography color="text.secondary" sx={{ textAlign: { xs: "left", sm: "right" } }}>{label}</Typography>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

export function RecipeSettings(props: Props) {
  const { t, beansAmount, setBeansAmount, roastLevel, setRoastLevel, flavor, setFlavor, strength, setStrength, waterTemperature, soundOn, setSoundOn, vibrationOn, setVibrationOn, voice, setVoice, disabled } = props;
  const toggleSx = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    width: "100%",
    "& .MuiToggleButton-root": { minWidth: 0, px: 0.75, whiteSpace: "nowrap" },
  };

  return (
    <Card variant="outlined" sx={{ mb: 2.5, borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <SettingRow label={t.roastLevel}>
            <ToggleButtonGroup value={roastLevel} exclusive disabled={disabled} onChange={(_, value: RoastLevel | null) => value && setRoastLevel(value)} size="small" sx={toggleSx}>
              <ToggleButton value="light">{t.lightRoast}</ToggleButton>
              <ToggleButton value="medium">{t.mediumRoast}</ToggleButton>
              <ToggleButton value="dark">{t.darkRoast}</ToggleButton>
            </ToggleButtonGroup>
          </SettingRow>
          <SettingRow label={t.waterTemp}><Typography fontWeight={700}>{waterTemperature}℃</Typography></SettingRow>
          <SettingRow label={t.beansAmount}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button aria-label="decrease" variant="outlined" disabled={disabled || beansAmount <= 1} onClick={() => setBeansAmount(beansAmount - 1)} sx={{ minWidth: 40 }}><RemoveIcon /></Button>
              <Typography minWidth={54} textAlign="center" fontWeight={700}>{beansAmount}g</Typography>
              <Button aria-label="increase" variant="outlined" disabled={disabled} onClick={() => setBeansAmount(beansAmount + 1)} sx={{ minWidth: 40 }}><AddIcon /></Button>
              <Typography color="text.secondary">/ {beansAmount * 15}g</Typography>
            </Stack>
          </SettingRow>
          <SettingRow label={t.taste}>
            <ToggleButtonGroup value={flavor} exclusive disabled={disabled} onChange={(_, value: Flavor | null) => value && setFlavor(value)} size="small" sx={toggleSx}>
              <ToggleButton value="sweet">{t.sweet}</ToggleButton>
              <ToggleButton value="middle">{t.middle}</ToggleButton>
              <ToggleButton value="sour">{t.sour}</ToggleButton>
            </ToggleButtonGroup>
          </SettingRow>
          <SettingRow label={t.strength}>
            <ToggleButtonGroup value={strength} exclusive disabled={disabled} onChange={(_, value: Strength | null) => value && setStrength(value)} size="small" sx={toggleSx}>
              <ToggleButton value="light">{t.light}</ToggleButton>
              <ToggleButton value="medium">{t.medium}</ToggleButton>
              <ToggleButton value="strong">{t.strong}</ToggleButton>
            </ToggleButtonGroup>
          </SettingRow>
          <SettingRow label={t.sound}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FormControlLabel control={<Switch inputProps={{ "aria-label": t.sound }} checked={soundOn} onChange={(_, checked) => setSoundOn(checked)} />} label={soundOn ? <VolumeUpIcon /> : <VolumeOffIcon />} />
              <ToggleButtonGroup value={voice} exclusive disabled={!soundOn} onChange={(_, value: Voice | null) => value && setVoice(value)} size="small">
                <ToggleButton value="female">{t.female}</ToggleButton>
                <ToggleButton value="male">{t.male}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </SettingRow>
          <SettingRow label={t.vibration}>
            <Switch inputProps={{ "aria-label": t.vibration }} checked={vibrationOn} onChange={(_, checked) => setVibrationOn(checked)} />
          </SettingRow>
          {disabled && <Typography variant="caption" color="text.secondary">{t.settingsLocked}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
