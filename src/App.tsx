import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BrowserRouter, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import { RecipeSettings } from "./components/RecipeSettings";
import { BrewCard } from "./components/BrewCard";
import Footer from "./components/Footer";
import { translations } from "./translations";
import { calculateSteps, getWaterTemperature, readBrewParameters, type Flavor, type RoastLevel, type Strength } from "./recipe";
import { choosePreferredLanguage, getSavedLanguage, languagePath, LANGUAGE_STORAGE_KEY, resolveLanguageRoute, type Language } from "./routing";
import { useAudioGuidance, type Voice } from "./hooks/useAudioGuidance";
import { useBrewTimerController, useWakeLock, type PreNotifyEvent } from "./shared/brew-timer";
import "./App.css";

const getTheme = (mode: "light" | "dark") => createTheme({
  palette: {
    mode,
    primary: { main: mode === "light" ? "#7A4E3A" : "#D5A98D" },
    secondary: { main: mode === "light" ? "#A26B4B" : "#C99A7B" },
    background: { default: mode === "light" ? "#F7F1E8" : "#151311", paper: mode === "light" ? "#FFFDF9" : "#211E1B" },
  },
  shape: { borderRadius: 14 },
  typography: { fontFamily: '"Inter", "Noto Sans JP", "Roboto", sans-serif' },
});

function TimerApp({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParameters = useRef(readBrewParameters(searchParams)).current;
  const [beansAmount, setBeansAmount] = useState(initialParameters.beansAmount);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(initialParameters.roastLevel);
  const [flavor, setFlavor] = useState<Flavor>(initialParameters.flavor);
  const [strength, setStrength] = useState<Strength>(initialParameters.strength);
  const [soundOn, setSoundOn] = useState(false);
  const [vibrationOn, setVibrationOn] = useState(false);
  const [voice, setVoice] = useState<Voice>("female");
  const t = translations[language];
  const theme = useMemo(() => getTheme(darkMode ? "dark" : "light"), [darkMode]);
  const steps = useMemo(() => calculateSteps(beansAmount, flavor, strength), [beansAmount, flavor, strength]);
  const timerSteps = useMemo(() => steps.map((step, index) => ({ timeSec: step.time, isFinish: index === steps.length - 1 })), [steps]);
  const audio = useAudioGuidance(language, voice, soundOn);
  const { playFirst, playNext, playFinish } = audio;
  const wakeLock = useWakeLock();

  const vibrate = useCallback((pattern: number | number[]) => {
    if (vibrationOn && "vibrate" in navigator) navigator.vibrate(pattern);
  }, [vibrationOn]);
  const onStart = useCallback(() => {
    playFirst();
    vibrate(180);
  }, [playFirst, vibrate]);
  const onPreNotify = useCallback(({ isFinish }: PreNotifyEvent) => {
    if (isFinish) playFinish();
    else playNext();
    vibrate(180);
  }, [playFinish, playNext, vibrate]);
  const onStepCrossed = useCallback(() => vibrate([140, 80, 140]), [vibrate]);
  const controller = useBrewTimerController({
    steps: timerSteps,
    speedMultiplier: 1,
    startDelayMs: 5000,
    wakeLock,
    onStart,
    onPreNotify,
    onStepCrossed,
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("beans", String(beansAmount));
    next.set("flavor", flavor);
    next.set("strength", strength);
    next.set("roast", roastLevel);
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [beansAmount, flavor, roastLevel, searchParams, setSearchParams, strength]);

  const settingsDisabled = controller.timer.status !== "idle" || controller.isStarting;
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh", py: 2, px: { xs: 1.5, sm: 3 } }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} language={language} handleLanguageChange={onLanguageChange} t={t} />
        <Typography variant="h5" align="center" fontWeight={800} mb={2}>{t.title}</Typography>
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
          waterTemperature={getWaterTemperature(roastLevel)}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          vibrationOn={vibrationOn}
          setVibrationOn={setVibrationOn}
          voice={voice}
          setVoice={setVoice}
          disabled={settingsDisabled}
        />
        <BrewCard
          t={t}
          steps={steps}
          currentTime={controller.timer.currentTime}
          currentStepIndex={controller.timer.currentStepIndex}
          status={controller.timer.status}
          isStarting={controller.isStarting}
          isRunningOrStarting={controller.isRunningOrStarting}
          previewStepIndex={controller.previewStepIndex}
          beansAmount={beansAmount}
          totalWater={beansAmount * 15}
          temperature={getWaterTemperature(roastLevel)}
          onToggle={controller.toggle}
          onReset={controller.reset}
        />
        <Footer t={t} />
      </Container>
    </ThemeProvider>
  );
}

function RoutedApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const preferredLanguage = choosePreferredLanguage(getSavedLanguage(), navigator.language);
  const route = resolveLanguageRoute(location.pathname, location.search, location.hash, preferredLanguage);
  if (route.redirectTo) return <Navigate to={route.redirectTo} replace />;

  const handleLanguageChange = (nextLanguage: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // The URL still changes when private browsing blocks storage.
    }
    navigate(`${languagePath(nextLanguage)}${location.search}${location.hash}`, { replace: true });
  };
  return <TimerApp language={route.language} onLanguageChange={handleLanguageChange} />;
}

export default function AppWrapper() {
  return <BrowserRouter><RoutedApp /></BrowserRouter>;
}
