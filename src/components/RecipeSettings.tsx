import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, Card, CardContent, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { Flavor, RoastLevel, Strength } from "../recipe";
import type { TranslationType } from "../types";

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
  totalWater: number;
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
  const { t, beansAmount, setBeansAmount, roastLevel, setRoastLevel, flavor, setFlavor, strength, setStrength, waterTemperature, totalWater, disabled } = props;
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
            </Stack>
          </SettingRow>
          <SettingRow label={t.waterVolume}>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h6" fontWeight={800}>{totalWater}g</Typography>
              <Typography variant="caption" color="text.secondary">{t.waterRatio}</Typography>
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
          {disabled && <Typography variant="caption" color="text.secondary">{t.settingsLocked}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
