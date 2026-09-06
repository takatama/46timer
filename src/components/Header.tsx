import SettingsIcon from "@mui/icons-material/Settings";
import { Box, IconButton, Typography } from "@mui/material";
import type { TranslationType } from "../types";

export default function Header({ t, onOpenSettings }: { t: TranslationType; onOpenSettings: () => void }) {
  return (
    <Box component="header" sx={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center", mb: 2 }}>
      <Box />
      <Typography variant="h5" align="center" fontWeight={800}>{t.title}</Typography>
      <IconButton onClick={onOpenSettings} color="inherit" aria-label={t.settings}><SettingsIcon /></IconButton>
    </Box>
  );
}
