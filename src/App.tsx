import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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

// Add dark mode translations
const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    title: "4:6 Method Timer",
    coffeeAmount: "Coffee Amount",
    waterVolume: "Water Volume",
    taste: "Taste",
    strength: "Strength",
    sweet: "Sweet",
    balance: "Balance",
    sour: "Sour",
    light: "Light",
    strong: "Strong",
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    flavorPour1: "Flavor pour 1",
    flavorPour2: "Flavor pour 2",
    strengthPour1: "Strength pour 1",
    strengthPour2: "Strength pour 2",
    strengthPour3: "Strength pour 3",
    finish: "Finish",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    roastLevel: "Roast Level",
    lightRoast: "Light",
    mediumRoast: "Medium",
    darkRoast: "Dark",
    waterTemp: "Water Temperature",
  },
  jp: {
    title: "4:6メソッド タイマー",
    coffeeAmount: "豆の量",
    waterVolume: "湯量",
    taste: "味",
    strength: "濃さ",
    sweet: "甘味",
    balance: "バランス",
    sour: "酸味",
    light: "薄い",
    strong: "濃い",
    play: "再生",
    pause: "一時停止",
    reset: "リセット",
    flavorPour1: "味注ぎ1",
    flavorPour2: "味注ぎ2",
    strengthPour1: "濃さ注ぎ1",
    strengthPour2: "濃さ注ぎ2",
    strengthPour3: "濃さ注ぎ3",
    finish: "完成",
    language: "言語",
    darkMode: "ダークモード",
    lightMode: "ライトモード",
    roastLevel: "焙煎度",
    lightRoast: "浅煎り",
    mediumRoast: "中煎り",
    darkRoast: "深煎り",
    waterTemp: "湯温",
  }
};

// Function to calculate timer steps based on the 4:6 method
function calculateSteps(coffeeAmount: number, flavor: string, strength: string) {
  // Total water used = coffeeAmount * 15
  const totalWater = coffeeAmount * 15;
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
  const steps = [];
  // Flavor pours are fixed at 0s and 45s
  steps.push({
    time: 0,
    pourAmount: flavor1,
    cumulative: flavor1,
    descriptionKey: "flavorPour1"
  });
  steps.push({
    time: 45,
    pourAmount: flavor2,
    cumulative: flavor1 + flavor2,
    descriptionKey: "flavorPour2"
  });
  // Strength pour 1 is fixed at 90 seconds (1:30)
  const strengthPourAmount = strengthWater / strengthSteps;
  steps.push({
    time: 90,
    pourAmount: strengthPourAmount,
    cumulative: steps[steps.length - 1].cumulative + strengthPourAmount,
    descriptionKey: "strengthPour1"
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
        descriptionKey: "strengthPour" + i
      });
    }
  }
  // Final step (finish) is fixed at 210 seconds
  steps.push({
    time: 210,
    pourAmount: 0,
    cumulative: totalWater,
    descriptionKey: "finish"
  });
  return steps;
}

function App() {
  // State variables for language, coffee parameters, and timer
  const [language, setLanguage] = useState<"en" | "jp">("en");
  const t = translations[language]; // shorthand for current translations
  const [coffeeAmount, setCoffeeAmount] = useState(20);
  const [flavor, setFlavor] = useState("balance");
  const [strength, setStrength] = useState("balance");
  const [currentTime, setCurrentTime] = useState(0);
  const [steps, setSteps] = useState<{ time: number; pourAmount: number; cumulative: number; descriptionKey: string; }[]>([]);
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
    const newSteps = calculateSteps(coffeeAmount, flavor, strength);
    setSteps(newSteps);
  }, [coffeeAmount, flavor, strength]);

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

  // Calculate arrow position (for timeline progress)
  const getArrowTop = () => {
    // The timeline container height is assumed to be 300px
    const containerHeight = 300;
    // Clamp currentTime to totalTime (210 seconds)
    const clampedTime = Math.min(currentTime, 210);
    // Calculate proportional position
    // subtract half the arrow height (approx 12px)
    return (clampedTime / 210) * containerHeight - 12 + 5;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ 
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        py: 2
      }}>
        {/* Language and dark mode toggles */}
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
        {/* Input section as a table */}
        <Box sx={{ mb: 2 }}>
          <Table sx={{ '& td, & th': { fontSize: '1.1rem' } }}>
            <TableBody>
            <TableRow>
                <TableCell align="right">
                  {t.roastLevel}:
                </TableCell>
                <TableCell align="left">
                  <ToggleButtonGroup
                    value={roastLevel}
                    exclusive
                    onChange={(_e, newRoast) => { if (newRoast) setRoastLevel(newRoast); }}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { fontSize: '1.0rem' } }}
                  >
                    <ToggleButton value="light">{t.lightRoast}</ToggleButton>
                    <ToggleButton value="medium">{t.mediumRoast}</ToggleButton>
                    <ToggleButton value="dark">{t.darkRoast}</ToggleButton>
                  </ToggleButtonGroup>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  {t.waterTemp}:
                </TableCell>
                <TableCell align="left">
                  {getWaterTemperature(roastLevel)}℃
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  {t.coffeeAmount}:
                </TableCell>
                <TableCell align="left">
                  <Button variant="outlined" onClick={() => setCoffeeAmount(coffeeAmount - 1)} disabled={coffeeAmount <= 1} size='small' sx={{ minWidth: '30px', padding: '5px' }}>
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Box component="span" sx={{ mx: 1 }}>{coffeeAmount}g</Box>
                  <Button variant="outlined" onClick={() => setCoffeeAmount(coffeeAmount + 1)} size='small' sx={{ minWidth: '30px', padding: '5px' }}>
                    <AddIcon fontSize='small'/>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  {t.waterVolume}:
                </TableCell>
                <TableCell align="left">
                  {coffeeAmount * 15}ml
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  {t.taste}:
                </TableCell>
                <TableCell align="left">
                  <ToggleButtonGroup
                    value={flavor}
                    exclusive
                    onChange={(_e, newFlavor) => { if (newFlavor) setFlavor(newFlavor); }}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { fontSize: '1.0rem' } }}
                  >
                    <ToggleButton value="sweet">{t.sweet}</ToggleButton>
                    <ToggleButton value="balance">{t.balance}</ToggleButton>
                    <ToggleButton value="sour">{t.sour}</ToggleButton>
                  </ToggleButtonGroup>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  {t.strength}:
                </TableCell>
                <TableCell align="left">
                  <ToggleButtonGroup
                    value={strength}
                    exclusive
                    onChange={(_e, newStrength) => { if (newStrength) setStrength(newStrength); }}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { fontSize: '1.0rem' } }}
                  >
                    <ToggleButton value="light">{t.light}</ToggleButton>
                    <ToggleButton value="balance">{t.balance}</ToggleButton>
                    <ToggleButton value="strong">{t.strong}</ToggleButton>
                  </ToggleButtonGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        {/* Control buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handlePlay} sx={{ mr: 1 }} className="play-button" startIcon={<PlayArrowIcon />}>
              {t.play}
            </Button>
            <Button variant="contained" color="primary" onClick={handlePause} sx={{ mr: 1 }} className="pause-button" startIcon={<PauseIcon />}>
              {t.pause}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleReset} className="reset-button" startIcon={<ReplayIcon />}>
              {t.reset}
            </Button>
          </Box>
        </Box>
        {/* Timeline / Steps */}
        <Box
          sx={{
            position: 'relative',
            height: '300px',
            borderLeft: '3px solid #ccc',
            ml: '40px', // leave space for arrow
            mb: 4
          }}
        >
          {/* Render each step using absolute positioning */}
          {steps.map((step, index) => {
            // Calculate top position (with 0:00 fixed at 5px, others with +5px offset)
            const containerHeight = 300;
            let topPos = (step.time / 210) * containerHeight;
            topPos = step.time === 0 ? 5 : topPos + 5;
            return (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: `${topPos}px`,
                  left: '0px',
                  transform: 'translateY(-50%)'
                }}
                className="step"
              >
                {/* Marker (black dot) */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: -1,
                    top: '50%',
                    width: '8px',
                    height: '8px',
                    bgcolor: darkMode ? 'white' : 'black',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="step-marker"
                />
                {/* Step text with horizontal line */}
                <Typography
                  variant="body2"
                  sx={{
                    ml: '20px',
                    textDecoration: currentTime > step.time ? 'underline' : 'none'
                  }}
                  className="step-text"
                >
                  {formatTime(step.time)} {t[step.descriptionKey]} ({Math.round(step.cumulative)}ml)
                </Typography>
              </Box>
            );
          })}
          {/* Progress arrow with timer display */}
          <Box
            className="arrow-container blinking"
            id="arrowContainer"
            sx={{
              position: 'absolute',
              left: '-41px',
              top: `${getArrowTop()}px`,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography variant="body1" className="time-display">
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="body1" className="arrow-icon">▼</Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
