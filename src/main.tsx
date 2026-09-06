import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppWrapper from './App.tsx'
import { choosePreferredLanguage, getSavedLanguage, resolveLanguageRoute } from './routing.ts'

const initialLanguage = resolveLanguageRoute(
  window.location.pathname,
  window.location.search,
  window.location.hash,
  choosePreferredLanguage(getSavedLanguage(), navigator.language),
).language
document.documentElement.lang = initialLanguage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)
