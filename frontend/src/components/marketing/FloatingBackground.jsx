import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { palette } from '../../theme/colors';

const aurora = (size, top, left, color, duration, delay = 0) => (
  <Box
    component={motion.div}
    animate={{
      y: [0, -24, 0, 18, 0],
      x: [0, 16, 0, -12, 0],
      scale: [1, 1.08, 1, 0.96, 1],
    }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    sx={{
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}, transparent 68%)`,
      filter: 'blur(40px)',
      pointerEvents: 'none',
    }}
  />
);

const FloatingBackground = ({ intense = false }) => (
  <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {aurora(intense ? 520 : 420, '5%', '58%', 'rgba(199,255,58,0.14)', 14)}
    {aurora(380, '48%', '-8%', 'rgba(236,255,182,0.2)', 18, 2)}
    {aurora(260, '18%', '8%', 'rgba(199,255,58,0.08)', 12, 1)}
    {intense && aurora(300, '70%', '75%', 'rgba(17,17,17,0.04)', 16, 0.5)}

    <Box
      component={motion.div}
      animate={{ opacity: [0.25, 0.45, 0.25] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(17,17,17,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(17,17,17,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 15%, transparent 78%)',
      }}
    />

    {/* Spotlight cone */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120%',
        height: '55%',
        background: `radial-gradient(ellipse at 50% 0%, rgba(199,255,58,0.07), transparent 62%)`,
      }}
    />
  </Box>
);

export default FloatingBackground;
