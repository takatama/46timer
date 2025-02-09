import React, { useState } from 'react';
import { Box, Button, IconButton, useMediaQuery } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { TranslationType } from '../types';

interface ControlsProps {
  t: TranslationType;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onToggleSound: (isSoundOn: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({ t, onPlay, onPause, onReset, onToggleSound }) => {
  const isSmallScreen = useMediaQuery('(max-width:376px)');
  const [isSoundOn, setIsSoundOn] = useState(true);

  const handleToggleSound = () => {
    setIsSoundOn(!isSoundOn);
    onToggleSound(!isSoundOn);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
      <IconButton onClick={handleToggleSound} sx={{ mr: 1 }}>
        {isSoundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
      </IconButton>
      <Button
        variant="contained"
        color="primary"
        onClick={onPlay}
        sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <PlayArrowIcon />
        {!isSmallScreen && t.play}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onPause}
        sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <PauseIcon />
        {!isSmallScreen && t.pause}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onReset}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ReplayIcon />
        {!isSmallScreen && t.reset}
      </Button>
    </Box>
  );
};

export default Controls;