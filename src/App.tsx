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
import { Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import './App.css';

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

interface StaticTranslations {
  title: string;
  beansAmount: string;
  waterVolume: string;
  taste: string;
  strength: string;
  sweet: string;
  balance: string;
  sour: string;
  light: string;
  strong: string;
  play: string;
  pause: string;
  reset: string;
  language: string;
  darkMode: string;
  lightMode: string;
  roastLevel: string;
  lightRoast: string;
  mediumRoast: string;
  darkRoast: string;
  waterTemp: string;
  footerMethodBy: string;
  footerMethodVideo: string;
  footerCreatedBy: string;
}

interface DynamicTranslations {
  flavorPour1: (amount: number) => string;
  flavorPour2: (amount: number) => string;
  strengthPour1: (amount: number) => string;
  strengthPour2: (amount: number) => string;
  strengthPour3: (amount: number) => string;
  finish: () => string;
}

type TranslationType = StaticTranslations & DynamicTranslations;

// Add dark mode translations
const translations: Record<'en' | 'jp', TranslationType> = {
  en: {
    title: "4:6 Method Timer",
    beansAmount: "Beans",
    waterVolume: "Water",
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
    flavorPour1: (amount: number) => `Pour up to ${amount}g`,
    flavorPour2: (amount: number) => `Pour up to ${amount}g`,
    strengthPour1: (amount: number) => `Pour up to ${amount}g`,
    strengthPour2: (amount: number) => `Pour up to ${amount}g`,
    strengthPour3: (amount: number) => `Pour up to ${amount}g`,
    finish: () => "Finish",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    roastLevel: "Roast",
    lightRoast: "Light",
    mediumRoast: "Medium",
    darkRoast: "Dark",
    waterTemp: "Temp",
    footerMethodBy: "The 4:6 method was created by Tetsu Kasuya",
    footerMethodVideo: "Method video",
    footerCreatedBy: "Created by Hirokazu Takatama",
  },
  jp: {
    title: "4:6メソッド タイマー",
    beansAmount: "豆の量",
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
    flavorPour1: (amount: number) => `${amount}g まで注湯`,
    flavorPour2: (amount: number) => `${amount}g まで注湯`,
    strengthPour1: (amount: number) => `${amount}g まで注湯`,
    strengthPour2: (amount: number) => `${amount}g まで注湯`,
    strengthPour3: (amount: number) => `${amount}g まで注湯`,
    finish: () => "完成",
    language: "言語",
    darkMode: "ダークモード",
    lightMode: "ライトモード",
    roastLevel: "焙煎度",
    lightRoast: "浅煎り",
    mediumRoast: "中煎り",
    darkRoast: "深煎り",
    waterTemp: "湯温",
    footerMethodBy: "4:6メソッドは粕谷哲氏によって考案されました",
    footerMethodVideo: "メソッド解説動画",
    footerCreatedBy: "Created by Hirokazu Takatama",
  }
};

// Timeline constants
const TIMELINE_CONSTANTS = {
  CONTAINER_HEIGHT: 300,
  TOTAL_TIME: 210,
  MARKER_SIZE: 8,
  ARROW_OFFSET: 45,
  ARROW_HEIGHT: 14,
  TIMELINE_LEFT_MARGIN: 80,
  STEP_TEXT_MARGIN: 20,
  FIRST_STEP_OFFSET: 5,
  FONT_SIZE: '1.1rem' // default size of Typography variant="body2"
} as const;

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

// Add new type for step status
type StepStatus = 'completed' | 'current' | 'upcoming' | 'next';

// Modify step type to include status
interface Step {
  time: number;
  pourAmount: number;
  cumulative: number;
  descriptionKey: keyof DynamicTranslations;
  status: StepStatus;
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

  // Calculate arrow position (for timeline progress)
  const getArrowTop = () => {
    const clampedTime = Math.min(currentTime, TIMELINE_CONSTANTS.TOTAL_TIME);
    return (clampedTime / TIMELINE_CONSTANTS.TOTAL_TIME) * TIMELINE_CONSTANTS.CONTAINER_HEIGHT - TIMELINE_CONSTANTS.ARROW_HEIGHT + TIMELINE_CONSTANTS.FIRST_STEP_OFFSET;
  };

  const getStepPosition = (time: number) => {
    const topPos = (time / TIMELINE_CONSTANTS.TOTAL_TIME) * TIMELINE_CONSTANTS.CONTAINER_HEIGHT;
    return time === 0 ? TIMELINE_CONSTANTS.FIRST_STEP_OFFSET : topPos + TIMELINE_CONSTANTS.FIRST_STEP_OFFSET;
  };

  // Add function to update step statuses
  const updateStepStatuses = (currentTimeValue: number) => {
    setSteps(prevSteps => prevSteps.map((step, index) => {
      if (currentTimeValue >= step.time && (index === prevSteps.length - 1 || currentTimeValue < prevSteps[index + 1].time)) {
        return { ...step, status: 'current' };
      }
      if (currentTimeValue >= step.time) {
        return { ...step, status: 'completed' };
      }
      if (currentTimeValue >= step.time - 5 && currentTimeValue < step.time) {
        return { ...step, status: 'next' };
      }
      return { ...step, status: 'upcoming' };
    }));
  };

  // Update useEffect for timer
  useEffect(() => {
    updateStepStatuses(currentTime);
  }, [currentTime]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        py: 2,
        width: '412px',
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
          <Table sx={{
            '& td, & th': { fontSize: '1.1rem' },
            '& .MuiTableCell-root': {
              borderBottom: 'none',
              padding: '10px 16px',
            }
          }}>
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
                  {t.beansAmount}:
                </TableCell>
                <TableCell align="left">
                  <Button variant="outlined" onClick={() => setBeansAmount(beansAmount - 1)} disabled={beansAmount <= 1} size='small' sx={{ minWidth: '30px', padding: '5px' }}>
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Box component="span" sx={{ mx: 1 }}>{beansAmount}g</Box>
                  <Button variant="outlined" onClick={() => setBeansAmount(beansAmount + 1)} size='small' sx={{ minWidth: '30px', padding: '5px' }}>
                    <AddIcon fontSize='small' />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  {t.waterVolume}:
                </TableCell>
                <TableCell align="left">
                  {beansAmount * 15}ml
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
            <Button variant="contained" color="primary" onClick={handlePlay} sx={{ mr: 1 }} startIcon={<PlayArrowIcon />}>
              {t.play}
            </Button>
            <Button variant="contained" color="primary" onClick={handlePause} sx={{ mr: 1 }} startIcon={<PauseIcon />}>
              {t.pause}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleReset} startIcon={<ReplayIcon />}>
              {t.reset}
            </Button>
          </Box>
        </Box>
        {/* Timeline / Steps */}
        <Box
          sx={{
            position: 'relative',
            height: `${TIMELINE_CONSTANTS.CONTAINER_HEIGHT}px`,
            borderLeft: '3px solid #ccc',
            ml: `${TIMELINE_CONSTANTS.TIMELINE_LEFT_MARGIN}px`,
            mb: 4
          }}
        >
          {/* Render each step using absolute positioning */}
          {steps.map((step, index) => {
            // Calculate top position (with 0:00 fixed at 5px, others with +5px offset)
            const topPos = getStepPosition(step.time);
            return (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: `${topPos}px`,
                  left: '0px',
                  transform: 'translateY(-50%)'
                }}
              >
                {/* Marker (black dot) */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: -1,
                    top: '50%',
                    width: `${TIMELINE_CONSTANTS.MARKER_SIZE}px`,
                    height: `${TIMELINE_CONSTANTS.MARKER_SIZE}px`,
                    bgcolor: darkMode ? 'white' : 'black',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                {/* Step text with horizontal line */}
                <Typography
                  variant="body2"
                  sx={{
                    ml: `${TIMELINE_CONSTANTS.STEP_TEXT_MARGIN}px`,
                    fontSize: TIMELINE_CONSTANTS.FONT_SIZE,
                    fontWeight: step.status === 'current' ? 'bold' : 'normal',
                    textDecoration: step.status === 'completed' ? 'line-through' : 'none',
                    color: step.status === 'next' 
                      ? 'primary.main' 
                      : step.status === 'completed'
                      ? 'text.secondary'  // Completed steps are grayed out
                      : 'text.primary',   // Current and upcoming steps are black
                  }}
                >
                  {formatTime(step.time)} {(t[step.descriptionKey as keyof DynamicTranslations])(Math.round(step.cumulative))}
                </Typography>
              </Box>
            );
          })}
          {/* Progress arrow with timer display */}
          <Box
            id="arrowContainer"
            sx={{
              position: 'absolute',
              left: `-${TIMELINE_CONSTANTS.ARROW_OFFSET}px`,
              top: `${getArrowTop()}px`,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography variant="body1" sx={{ fontSize: TIMELINE_CONSTANTS.FONT_SIZE }}>
              {formatTime(currentTime)}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: TIMELINE_CONSTANTS.FONT_SIZE }}
              className="blinking"
            >▼</Typography>
          </Box>
        </Box>
        <Box sx={{
          mt: 'auto',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t.footerMethodBy}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <Link
              href={'https://www.youtube.com/watch?v=lJNPp-onikk'}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}
            >
              <YouTubeIcon fontSize="small" />
              {t.footerMethodVideo}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t.footerCreatedBy}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Link
              href="https://github.com/takatama/46timer"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <GitHubIcon fontSize="small" />
              46timer
            </Link>
            <Link
              href="https://x.com/takatama_jp"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <TwitterIcon fontSize="small" />
              @takatama_jp
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
