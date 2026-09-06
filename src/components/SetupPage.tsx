import { Button, Stack } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { Flavor, RoastLevel, Strength } from "../recipe";
import type { TranslationType } from "../types";
import { RecipeSettings } from "./RecipeSettings";

interface Props {
  t: TranslationType;
  beansAmount: number;
  setBeansAmount: (value: number) => void;
  roastLevel: RoastLevel;
  setRoastLevel: (value: RoastLevel) => void;
  flavor: Flavor;
  setFlavor: (value: Flavor) => void;
  strength: Strength;
  setStrength: (value: Strength) => void;
  waterTemperature: number;
  onStart: () => void;
}

export function SetupPage(props: Props) {
  const { t, beansAmount, setBeansAmount, roastLevel, setRoastLevel, flavor, setFlavor, strength, setStrength, waterTemperature, onStart } = props;
  return (
    <main>
      <RecipeSettings
        t={t}
        beansAmount={beansAmount}
        setBeansAmount={setBeansAmount}
        roastLevel={roastLevel}
        setRoastLevel={setRoastLevel}
        flavor={flavor}
        setFlavor={setFlavor}
        strength={strength}
        setStrength={setStrength}
        waterTemperature={waterTemperature}
        totalWater={beansAmount * 15}
        disabled={false}
      />
      <Stack alignItems="center" mb={3}>
        <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={onStart}>{t.startTimer}</Button>
      </Stack>
    </main>
  );
}
