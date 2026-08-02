import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { palette } from '../../theme/colors';

const GradientText = ({ children, sx = {} }) => (
  <Box
    component={motion.span}
    sx={{
      display: 'inline-block',
      background: `linear-gradient(135deg, ${palette.accentDark} 0%, ${palette.accent} 45%, ${palette.textPrimary} 100%)`,
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 6s ease infinite',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default GradientText;
