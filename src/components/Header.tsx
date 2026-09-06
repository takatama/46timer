import { Box, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import type { Language } from '../routing';
import type { TranslationType } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  language: Language;
  handleLanguageChange: (newLang: Language) => void;
  t: TranslationType;
}

export default function Header({ darkMode, setDarkMode, language, handleLanguageChange, t }: HeaderProps) {
  return (
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
        onChange={(_, value: Language | null) => value && handleLanguageChange(value)}
        size="small"
        aria-label={t.language}
      >
        <ToggleButton value="en">EN</ToggleButton>
        <ToggleButton value="ja">JA</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
