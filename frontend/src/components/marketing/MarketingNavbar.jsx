import { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowForward, Hub } from '@mui/icons-material';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { palette, iconCircleStyle, transitions, radii, shadows } from '../../theme/colors';

const MarketingNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box
      component={motion.header}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        bgcolor: scrolled ? 'rgba(252, 251, 248, 0.88)' : 'rgba(252, 251, 248, 0.65)',
        backdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${palette.border}`,
        transition: transitions.default,
      }}
    >
      <Box
        component={motion.div}
        style={{ scaleX, transformOrigin: '0%' }}
        sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, bgcolor: palette.accent }}
      />
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.25 }}>
          <Stack
            component={motion.div}
            direction="row"
            alignItems="center"
            spacing={1.5}
            whileHover={{ scale: 1.02 }}
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Box
              component={motion.div}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              sx={{
                width: 46,
                height: 46,
                ...iconCircleStyle,
                display: 'grid',
                placeItems: 'center',
                boxShadow: shadows.button,
                overflow: 'hidden',
              }}
            >
              <img src="/logo.png" alt="TwinDigital Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: palette.textPrimary, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                TwinDigital
              </Typography>
              <Typography variant="caption" sx={{ color: palette.textLabel }}>
                Infrastructure Digital Twin
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              onClick={() => navigate('/login')}
              sx={{ color: palette.textPrimary, fontWeight: 600, px: 2, '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}
            >
              Sign in
            </Button>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/login')}
              sx={{ px: 3, boxShadow: shadows.button }}
            >
              Open Console
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default MarketingNavbar;
