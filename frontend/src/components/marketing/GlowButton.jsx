import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { palette, shadows } from '../../theme/colors';

const GlowButton = ({ children, sx = {}, ...props }) => (
  <Button
    component={motion.button}
    whileHover={{ scale: 1.04, y: -3 }}
    whileTap={{ scale: 0.97 }}
    variant="contained"
    size="large"
    {...props}
    sx={{
      position: 'relative',
      overflow: 'hidden',
      bgcolor: palette.accent,
      color: '#111111',
      fontWeight: 700,
      boxShadow: shadows.button,
      px: 4,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)',
        transform: 'translateX(-120%)',
        animation: 'shimmer 3.5s ease-in-out infinite',
      },
      '&:hover': {
        bgcolor: palette.accentHover,
        boxShadow: '0 14px 40px rgba(199, 255, 58, 0.28)',
      },
      ...sx,
    }}
  >
    <Box component="span" sx={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {children}
    </Box>
  </Button>
);

export default GlowButton;
