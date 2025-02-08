import React from 'react';
import { Box, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  language: 'en' | 'ja';
  handleLanguageChange: (_e: React.MouseEvent<HTMLElement>, newLang: 'en' | 'ja') => void;
  t: any;
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
        onChange={handleLanguageChange}
        size="small"
      >
        <ToggleButton value="en">EN</ToggleButton>
        <ToggleButton value="ja">JA</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}