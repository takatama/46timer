import React from 'react';
import { Box, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import { TranslationType } from '../types';

interface ControlsProps {
  t: TranslationType;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ t, onPlay, onPause, onReset }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
      <Button variant="contained" color="primary" onClick={onPlay} sx={{ mr: 1 }} startIcon={<PlayArrowIcon />}>
        {t.play}
      </Button>
      <Button variant="contained" color="primary" onClick={onPause} sx={{ mr: 1 }} startIcon={<PauseIcon />}>
        {t.pause}
      </Button>
      <Button variant="contained" color="secondary" onClick={onReset} startIcon={<ReplayIcon />}>
        {t.reset}
      </Button>
    </Box>
  );
};

export default Controls;
