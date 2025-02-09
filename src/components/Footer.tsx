import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { TranslationType } from '../types';

interface FooterProps {
  t: TranslationType;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <Box sx={{
      mt: 'auto',
      pt: 2,
      borderTop: '1px solid',
      borderColor: 'divider',
      textAlign: 'center',
    }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t.footerMethodBy}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <Link
          href={'https://www.youtube.com/watch?v=lJNPp-onikk'}
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}
        >
          <YouTubeIcon fontSize="small" />
          {t.footerMethodVideo}
        </Link>
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t.footerCreatedBy}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
        <Link
          href="https://github.com/takatama/46timer"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <GitHubIcon fontSize="small" />
          46timer
        </Link>
        <Link
          href="https://x.com/takatama_jp"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <TwitterIcon fontSize="small" />
          @takatama_jp
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
