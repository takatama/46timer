import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Step, TranslationType, DynamicTranslations } from '../types';

interface TimelineProps {
  t: TranslationType;
  steps: Step[];
  currentTime: number;
  darkMode: boolean;
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
}

const TIMELINE_CONSTANTS = {
  CONTAINER_HEIGHT: 300,
  TOTAL_TIME: 210,
  MARKER_SIZE: 8,
  ARROW_OFFSET: 45,
  ARROW_HEIGHT: 14,
  TIMELINE_LEFT_MARGIN: 80,
  STEP_TEXT_MARGIN: 20,
  FIRST_STEP_OFFSET: 5,
  FONT_SIZE: '1.1rem'
} as const;

const Timeline: React.FC<TimelineProps> = ({ t, steps, setSteps, currentTime, darkMode }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
  };

  // Calculate arrow position (for timeline progress)
  const getArrowTop = () => {
    const clampedTime = Math.min(currentTime, TIMELINE_CONSTANTS.TOTAL_TIME);
    return (clampedTime / TIMELINE_CONSTANTS.TOTAL_TIME) * TIMELINE_CONSTANTS.CONTAINER_HEIGHT - TIMELINE_CONSTANTS.ARROW_HEIGHT + TIMELINE_CONSTANTS.FIRST_STEP_OFFSET;
  };

  // Add function to update step statuses
  const getStepPosition = (time: number) => {
    const topPos = (time / TIMELINE_CONSTANTS.TOTAL_TIME) * TIMELINE_CONSTANTS.CONTAINER_HEIGHT;
    return time === 0 ? TIMELINE_CONSTANTS.FIRST_STEP_OFFSET : topPos + TIMELINE_CONSTANTS.FIRST_STEP_OFFSET;
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
      if (currentTimeValue >= step.time - 5 && currentTimeValue < step.time) {
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
        height: `${TIMELINE_CONSTANTS.CONTAINER_HEIGHT}px`,
        borderLeft: '3px solid #ccc',
        ml: `${TIMELINE_CONSTANTS.TIMELINE_LEFT_MARGIN}px`,
        mb: 4
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
                top: '50%',
                width: `${TIMELINE_CONSTANTS.MARKER_SIZE}px`,
                height: `${TIMELINE_CONSTANTS.MARKER_SIZE}px`,
                bgcolor: darkMode ? 'white' : 'black',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            {/* Step text with horizontal line */}
            <Typography
              variant="body2"
              sx={{
                ml: `${TIMELINE_CONSTANTS.STEP_TEXT_MARGIN}px`,
                fontSize: TIMELINE_CONSTANTS.FONT_SIZE,
                fontWeight: step.status === 'current' ? 'bold' : 'normal',
                textDecoration: step.status === 'completed' ? 'line-through' : 'none',
                color: step.status === 'next'
                  ? 'primary.main'
                  : step.status === 'completed'
                    ? 'text.secondary'  // Completed steps are grayed out
                    : 'text.primary',   // Current and upcoming steps are black
              }}
            >
              {formatTime(step.time)} {(t[step.descriptionKey as keyof DynamicTranslations])(Math.round(step.cumulative))}
            </Typography>
          </Box>
        );
      })}
      {/* Progress arrow with timer display */}
      <Box
        id="arrowContainer"
        sx={{
          position: 'absolute',
          left: `-${TIMELINE_CONSTANTS.ARROW_OFFSET}px`,
          top: `${getArrowTop()}px`,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography variant="body1" sx={{ fontSize: TIMELINE_CONSTANTS.FONT_SIZE }}>
          {formatTime(currentTime)}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: TIMELINE_CONSTANTS.FONT_SIZE }}
          className="blinking"
        >▼</Typography>
      </Box>
    </Box>
  );
};

export default Timeline;
