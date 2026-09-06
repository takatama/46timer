import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Container, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BrowserRouter, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import { BrewCard } from "./components/BrewCard";
import { CoffeeNews } from "./components/CoffeeNews";
import Footer from "./components/Footer";
import { SettingsModal } from "./components/SettingsModal";
import { SetupPage } from "./components/SetupPage";
import { useAudioGuidance, type Voice } from "./hooks/useAudioGuidance";
import { useCoffeeNews } from "./hooks/useCoffeeNews";
import { calculateSteps, getWaterTemperature, readBrewParameters, type Flavor, type RoastLevel, type Strength } from "./recipe";
import { choosePreferredLanguage, getSavedLanguage, languagePath, LANGUAGE_STORAGE_KEY, resolveLanguageRoute, type AppPage, type Language } from "./routing";
import { useBrewTimerController, useWakeLock, type PreNotifyEvent } from "./shared/brew-timer";
import { translations } from "./translations";
import "./App.css";

const SETTINGS_STORAGE_KEY = "46timer-settings";

interface SavedSettings {
  soundOn?: boolean;
  vibrationOn?: boolean;
  animationOn?: boolean;
  darkMode?: boolean;
  voice?: Voice;
}

function readSavedSettings(): SavedSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) as SavedSettings : {};
  } catch {
    return {};
  }
}

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

function TimerApp({ language, page, onLanguageChange, onPageChange }: {
  language: Language;
  page: AppPage;
  onLanguageChange: (language: Language) => void;
  onPageChange: (page: AppPage) => void;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const savedSettings = useRef(readSavedSettings()).current;
  const [darkMode, setDarkMode] = useState(savedSettings.darkMode ?? prefersDarkMode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParameters = useRef(readBrewParameters(searchParams)).current;
  const [beansAmount, setBeansAmount] = useState(initialParameters.beansAmount);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(initialParameters.roastLevel);
  const [flavor, setFlavor] = useState<Flavor>(initialParameters.flavor);
  const [strength, setStrength] = useState<Strength>(initialParameters.strength);
  const [soundOn, setSoundOn] = useState(savedSettings.soundOn ?? false);
  const [vibrationOn, setVibrationOn] = useState(savedSettings.vibrationOn ?? false);
  const [animationOn, setAnimationOn] = useState(savedSettings.animationOn ?? true);
  const [voice, setVoice] = useState<Voice>(savedSettings.voice === "male" ? "male" : "female");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const t = translations[language];
  const theme = useMemo(() => getTheme(darkMode ? "dark" : "light"), [darkMode]);
  const steps = useMemo(() => calculateSteps(beansAmount, flavor, strength), [beansAmount, flavor, strength]);
  const timerSteps = useMemo(() => steps.map((step, index) => ({ timeSec: step.time, isFinish: index === steps.length - 1 })), [steps]);
  const { playFirst, playNext, playFinish } = useAudioGuidance(language, voice, soundOn);
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
    startDelayMs: animationOn ? 5000 : 0,
    wakeLock,
    onStart,
    onPreNotify,
    onStepCrossed,
  });
  const timerStatus = controller.timer.status;
  const resetTimer = controller.reset;
  const isFinished = timerStatus === "finished";
  const news = useCoffeeNews(language, isFinished);

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

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ soundOn, vibrationOn, animationOn, darkMode, voice }));
    } catch {
      // Settings remain usable for the current visit when storage is blocked.
    }
  }, [animationOn, darkMode, soundOn, vibrationOn, voice]);

  useEffect(() => {
    if (page === "setup" && timerStatus !== "idle") resetTimer();
  }, [page, resetTimer, timerStatus]);

  const handleStart = () => {
    controller.toggle();
    onPageChange("timer");
  };
  const handleEdit = () => {
    controller.reset();
    onPageChange("setup");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh", py: 2, px: { xs: 1.5, sm: 3 } }}>
        <Header t={t} onOpenSettings={() => setSettingsOpen(true)} />
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          t={t}
          language={language}
          onLanguageChange={onLanguageChange}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          vibrationOn={vibrationOn}
          setVibrationOn={setVibrationOn}
          voice={voice}
          setVoice={setVoice}
          animationOn={animationOn}
          setAnimationOn={setAnimationOn}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {page === "setup" ? (
          <SetupPage
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
            onStart={handleStart}
          />
        ) : (
          <main>
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
            {isFinished && <CoffeeNews t={t} news={news.news} loading={news.loading} failed={news.failed} />}
            <Stack alignItems="center" mb={3}>
              <Button variant="text" onClick={handleEdit}>{t.editSettings}</Button>
            </Stack>
          </main>
        )}
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
    navigate(`${languagePath(nextLanguage, route.page)}${location.search}${location.hash}`, { replace: true });
  };
  const handlePageChange = (nextPage: AppPage) => {
    navigate(`${languagePath(route.language, nextPage)}${location.search}${location.hash}`);
  };
  return <TimerApp language={route.language} page={route.page} onLanguageChange={handleLanguageChange} onPageChange={handlePageChange} />;
}

export default function AppWrapper() {
  return <BrowserRouter><RoutedApp /></BrowserRouter>;
}
