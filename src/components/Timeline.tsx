import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Step, TranslationType, DynamicTranslations } from '../types';

interface TimelineProps {
  t: TranslationType;
  steps: Step[];
  currentTime: number;
  darkMode: boolean;
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  soundOn: boolean;
  language: 'en' | 'ja';
}

const CONTAINER_HEIGHT = 300;
const TOTAL_TIME = 210;
const MARKER_SIZE = 8;
const ARROW_OFFSET = 45;
const ARROW_HEIGHT = 25;
const TIMELINE_LEFT_MARGIN = 80;
const STEP_TEXT_MARGIN = 20;
const FIRST_STEP_OFFSET = 10;
const FONT_SIZE = '1.1rem';
const INDICATE_NEXT_STEP_SEC = 3;

const Timeline: React.FC<TimelineProps> = ({ t, steps, setSteps, currentTime, darkMode, soundOn, language }) => {
  const isPlayingRef = useRef(false);
  const nextStepAudio = useRef(new Audio());
  const finishAudio = useRef(new Audio());

  // Reset isPlaying when audio ends
  useEffect(() => {
    nextStepAudio.current.addEventListener('ended', () => isPlayingRef.current = false);
    finishAudio.current.addEventListener('ended', () => isPlayingRef.current = false);
  }, []);

  // Update audio sources when language changes
  useEffect(() => {
    nextStepAudio.current.src = `/audio/${language}-male-next-step.wav`;
    finishAudio.current.src = `/audio/${language}-male-finish.wav`;
  }, [language]);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
  };

  // Calculate arrow position (for timeline progress)
  const getArrowTop = () => {
    const clampedTime = Math.min(currentTime, TOTAL_TIME);
    return (clampedTime / TOTAL_TIME) * CONTAINER_HEIGHT - ARROW_HEIGHT + FIRST_STEP_OFFSET;
  };

  // Add function to update step statuses
  const getStepPosition = (time: number) => {
    const topPos = (time / TOTAL_TIME) * CONTAINER_HEIGHT;
    return time === 0 ? FIRST_STEP_OFFSET : topPos + FIRST_STEP_OFFSET;
  };
  
  const playAudio = (isFinish: boolean) => {
    if (!soundOn || isPlayingRef.current) return;
    if (isFinish) {
      finishAudio.current.pause();
      finishAudio.current.currentTime = 0;
      finishAudio.current.play();
    } else {
      nextStepAudio.current.pause();
      nextStepAudio.current.currentTime = 0;
      nextStepAudio.current.play();
    }
    isPlayingRef.current = true;
  };

  // Add function to update step statuses
  const updateStepStatuses = (currentTimeValue: number) => {
    setSteps(prevSteps => prevSteps.map((step, index) => {
      if (currentTimeValue >= step.time && (index === prevSteps.length - 1 || currentTimeValue < prevSteps[index + 1].time)) {
        return { ...step, status: 'current' };
      }
      if (currentTimeValue >= step.time) {
        return { ...step, status: 'completed' };
      }
      if (currentTimeValue >= step.time - INDICATE_NEXT_STEP_SEC && currentTimeValue < step.time) {
        const isFinish = index === prevSteps.length - 1;
        playAudio(isFinish);
        return { ...step, status: 'next' };
      }
      return { ...step, status: 'upcoming' };
    }));
  };

  // Update useEffect for timer
  useEffect(() => {
    updateStepStatuses(currentTime);
  }, [currentTime]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: `${CONTAINER_HEIGHT}px`,
        borderLeft: '3px solid #ccc',
        ml: `${TIMELINE_LEFT_MARGIN}px`,
        mb: 7
      }}
    >
      {/* Render each step using absolute positioning */}
      {steps.map((step, index) => {
        // Calculate top position (with 0:00 fixed at 5px, others with +5px offset)
        const topPos = getStepPosition(step.time);
        return (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: `${topPos}px`,
              left: '0px',
              transform: 'translateY(-50%)'
            }}
          >
            {/* Marker (black dot) */}
            <Box
              sx={{
                position: 'absolute',
                left: -1,
                top: '25%',
                width: `${MARKER_SIZE}px`,
                height: `${MARKER_SIZE}px`,
                bgcolor: darkMode ? 'white' : 'black',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            {/* Step text with horizontal line */}
            <Typography
              variant="body2"
              sx={{
                ml: `${STEP_TEXT_MARGIN}px`,
                fontSize: FONT_SIZE,
                ...{
                  current: { fontWeight: 'bold' },
                  next: { fontWeight: 'bold', color: 'primary.main' },
                  completed: { textDecoration: 'line-through', color: 'text.secondary' },
                  upcoming: { color: 'text.primary' }
                }[step.status]
              }}
            >
              {formatTime(step.time)}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: `${STEP_TEXT_MARGIN}px`,
                fontSize: FONT_SIZE,
                ...{
                  current: { fontWeight: 'bold' },
                  next: { fontWeight: 'bold', color: 'primary.main' },
                  completed: { textDecoration: 'line-through', color: 'text.secondary' },
                  upcoming: { color: 'text.primary' }
                }[step.status]
              }}
            >
              {(t[step.descriptionKey as keyof DynamicTranslations])(Math.round(step.cumulative))}
            </Typography>
          </Box>
        );
      })}
      {/* Progress arrow with timer display */}
      <Box
        id="arrowContainer"
        sx={{
          position: 'absolute',
          left: `-${ARROW_OFFSET}px`,
          top: `${getArrowTop()}px`,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography variant="body1" sx={{ fontSize: FONT_SIZE }}>
          {formatTime(currentTime)}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: FONT_SIZE }}
          className="blinking"
        >▼</Typography>
      </Box>
    </Box>
  );
};

export default Timeline;
