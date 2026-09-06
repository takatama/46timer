import { useEffect } from "react";
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { Header } from "../shared/components/Header";
import { SetupPage } from "./routes/SetupPage";
import { TimerPage } from "./routes/TimerPage";
import { useSettingsStore } from "../features/settings/store";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import { DisplayLanguageProvider } from "../shared/i18n/DisplayLanguage";
import {
  choosePreferredLanguage,
  resolveAppRoute,
  type AppPage,
} from "../shared/i18n/routing";
import styles from "./App.module.css";

function AppShell({ page }: { page: AppPage }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [page]);

  return (
    <div className={styles.app}>
      <Header />
      <ErrorBoundary>
        {page === "setup" && <SetupPage />}
        {page === "timer" && <TimerPage />}
      </ErrorBoundary>
    </div>
  );
}

function RoutedApp() {
  const location = useLocation();
  const savedLanguage = useSettingsStore((state) => state.language);
  const preferredLanguage = choosePreferredLanguage(
    savedLanguage,
    typeof navigator === "undefined" ? undefined : navigator.language,
  );
  const route = resolveAppRoute(
    location.pathname,
    location.search,
    location.hash,
    preferredLanguage,
  );

  if (route.redirectTo) {
    return <Navigate to={route.redirectTo} replace />;
  }

  return (
    <DisplayLanguageProvider language={route.language}>
      <AppShell page={route.page} />
    </DisplayLanguageProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}
