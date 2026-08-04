import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { palette, shadows, radii, layout, transitions } from '../../theme/colors';

const SpotlightCard = ({ children, sx = {}, delay = 0, accent = false }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -10, transition: { duration: 0.28 } }}
    sx={{
      height: '100%',
      p: layout.cardPadding,
      borderRadius: `${radii.xl}px`,
      position: 'relative',
      overflow: 'hidden',
      bgcolor: accent ? palette.textPrimary : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(16px)',
      border: `1px solid ${accent ? 'rgba(255,255,255,0.08)' : palette.border}`,
      boxShadow: shadows.card,
      transition: transitions.default,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: accent
          ? `radial-gradient(circle at 20% 0%, rgba(199,255,58,0.15), transparent 50%)`
          : `radial-gradient(circle at var(--mx, 50%) var(--my, 0%), rgba(199,255,58,0.12), transparent 45%)`,
        opacity: accent ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      },
      '&:hover': {
        boxShadow: shadows.cardHover,
        '&::before': { opacity: 1 },
      },
      ...sx,
    }}
    onMouseMove={(e) => {
      if (accent) return;
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      e.currentTarget.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
  </Box>
);

export default SpotlightCard;
