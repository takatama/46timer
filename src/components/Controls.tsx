import React, { useState } from 'react';
import { Box, Button, IconButton, useMediaQuery } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MaleIcon from '@mui/icons-material/Man';
import FemaleIcon from '@mui/icons-material/Woman';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import { TranslationType } from '../types';

interface ControlsProps {
  t: TranslationType;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onToggleSound: (isSoundOn: boolean) => void;
  voice: 'male' | 'female';
  setVoice: (newVoice: 'male' | 'female') => void;
}

const Controls: React.FC<ControlsProps> = ({ t, onPlay, onPause, onReset, onToggleSound, voice, setVoice }) => {
  const isSmallScreen = useMediaQuery('(max-width:465px)');
  const [isSoundOn, setIsSoundOn] = useState(false);

  const handleToggleSound = () => {
    setIsSoundOn(!isSoundOn);
    onToggleSound(!isSoundOn);
  };
  
  const handleToggleVoice = () => {
    setVoice(voice === 'male' ? 'female' : 'male');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
      <IconButton onClick={handleToggleSound}>
        {isSoundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
      </IconButton>

      <IconButton onClick={handleToggleVoice} sx={{ mr: 1 }}>
        {voice === 'male' ? <MaleIcon /> : <FemaleIcon />}
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