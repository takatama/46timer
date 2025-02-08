import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useMediaQuery from '@mui/material/useMediaQuery';
import Settings from './components/Settings';
import Controls from './components/Controls';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import './App.css';
import { translations } from './translations/index'

// Create theme with both light and dark modes
const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#6D4C41' : '#A1887F',
    },
    secondary: {
      main: mode === 'light' ? '#A1887F' : '#8D6E63',
    },
    background: {
      default: mode === 'light' ? '#F5F5DC' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});

// Function to calculate timer steps based on the 4:6 method
function calculateSteps(beansAmount: number, flavor: string, strength: string) {
  // Total water used = beansAmount * 15
  const totalWater = beansAmount * 15;
  const flavorWater = totalWater * 0.4;
  const strengthWater = totalWater * 0.6;
  let flavor1, flavor2;
  // Adjust flavor pours based on taste selection
  if (flavor === "sweet") {
    flavor1 = flavorWater * 0.4;
    flavor2 = flavorWater * 0.6;
  } else if (flavor === "sour") {
    flavor1 = flavorWater * 0.6;
    flavor2 = flavorWater * 0.4;
  } else {
    flavor1 = flavorWater * 0.5;
    flavor2 = flavorWater * 0.5;
  }
  // Determine number of strength pours based on strength selection
  let strengthSteps;
  if (strength === "light") {
    strengthSteps = 1;
  } else if (strength === "strong") {
    strengthSteps = 3;
  } else {
    strengthSteps = 2;
  }
  const steps: Array<{
    time: number;
    pourAmount: number;
    cumulative: number;
    descriptionKey: keyof DynamicTranslations;
    status: StepStatus;
  }> = [];
  // Flavor pours are fixed at 0s and 45s
  steps.push({
    time: 0,
    pourAmount: flavor1,
    cumulative: flavor1,
    descriptionKey: "flavorPour1",
    status: 'upcoming'
  });
  steps.push({
    time: 45,
    pourAmount: flavor2,
    cumulative: flavor1 + flavor2,
    descriptionKey: "flavorPour2",
    status: 'upcoming'
  });
  // Strength pour 1 is fixed at 90 seconds (1:30)
  const strengthPourAmount = strengthWater / strengthSteps;
  steps.push({
    time: 90,
    pourAmount: strengthPourAmount,
    cumulative: steps[steps.length - 1].cumulative + strengthPourAmount,
    descriptionKey: "strengthPour1",
    status: 'upcoming'
  });
  // If more than one strength pour, calculate remaining pours evenly over the remaining 120 seconds (210 - 90)
  if (strengthSteps > 1) {
    const remainingPours = strengthSteps - 1;
    const remainingTime = 210 - 90; // 120 seconds remaining
    const interval = remainingTime / (remainingPours + 1);
    for (let i = 2; i <= strengthSteps; i++) {
      const t = 90 + interval * (i - 1);
      const cumulative: number = steps[steps.length - 1].cumulative + strengthPourAmount;
      steps.push({
        time: t,
        pourAmount: strengthPourAmount,
        cumulative: cumulative,
        descriptionKey: `strengthPour${i}` as keyof DynamicTranslations,
        status: 'upcoming'
      });
    }
  }
  // Final step (finish) is fixed at 210 seconds
  steps.push({
    time: 210,
    pourAmount: 0,
    cumulative: totalWater,
    descriptionKey: "finish",
    status: 'upcoming'
  });
  return steps;
}

function App() {
  // State variables for language, coffee parameters, and timer
  const [language, setLanguage] = useState<"en" | "jp">("en");
  const t = translations[language]; // shorthand for current translations
  const [beansAmount, setBeansAmount] = useState(20);
  const [flavor, setFlavor] = useState("balance");
  const [strength, setStrength] = useState("balance");
  const [currentTime, setCurrentTime] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const theme = getTheme(darkMode ? 'dark' : 'light');
  const [roastLevel, setRoastLevel] = useState("medium");

  // Function to get temperature based on roast level
  const getWaterTemperature = (roast: string) => {
    switch (roast) {
      case "light": return 93;
      case "dark": return 83;
      default: return 88;
    }
  };

  // Recalculate steps whenever coffee parameters change
  useEffect(() => {
    const newSteps = calculateSteps(beansAmount, flavor, strength);
    setSteps(newSteps);
  }, [beansAmount, flavor, strength]);

  // Cleanup timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update dark mode when system preference changes
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  // Function to format seconds as "m:ss"
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
  };

  // Start or resume the timer
  const handlePlay = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => prev + 1);
    }, 1000);
  };

  // Pause the timer
  const handlePause = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setTimerRunning(false);
  };

  // Reset the timer
  const handleReset = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setTimerRunning(false);
    setCurrentTime(0);
  };

  // Handler for language toggle
  const handleLanguageChange = (_e: React.MouseEvent<HTMLElement>, newLang: "en" | "jp") => {
    if (newLang) {
      setLanguage(newLang);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        py: 2,
        width: '412px',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            color="inherit"
            title={darkMode ? t.lightMode : t.darkMode}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleLanguageChange}
            size="small"
          >
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="jp">JP</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          {t.title}
        </Typography>

        <Settings
          t={t}
          beansAmount={beansAmount}
          setBeansAmount={setBeansAmount}
          roastLevel={roastLevel}
          setRoastLevel={setRoastLevel}
          flavor={flavor}
          setFlavor={setFlavor}
          strength={strength}
          setStrength={setStrength}
        />

        <Controls
          t={t}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
        />

        <Timeline
          t={t}
          steps={steps}
          setSteps={setSteps}
          currentTime={currentTime}
          darkMode={darkMode}
        />

        <Footer t={t} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
