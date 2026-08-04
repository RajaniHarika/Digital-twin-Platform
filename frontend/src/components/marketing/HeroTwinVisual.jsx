import { useEffect, useState } from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiberManualRecord, TrendingUp } from '@mui/icons-material';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { palette, shadows, radii, gradients } from '../../theme/colors';
import { ease } from '../../theme/motion';

const rows = [
  { label: 'Production cluster', value: 'ap-south-1 · 3 nodes · 156 pods', load: 78 },
  { label: 'Active simulation', value: 'Ingress traffic spike · running', load: 45 },
  { label: 'Predicted monthly cost', value: '$30,150 → $33,480', load: 62 },
];

const sparkData = [
  { v: 40 }, { v: 52 }, { v: 48 }, { v: 65 }, { v: 58 }, { v: 72 }, { v: 68 }, { v: 75 },
];

const AnimatedBar = ({ value, delay = 0 }) => (
  <Box sx={{ height: 5, bgcolor: 'rgba(17,17,17,0.04)', borderRadius: 3, overflow: 'hidden', mt: 1.25 }}>
    <Box
      component={motion.div}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1.4, delay: 0.3 + delay * 0.12, ease: ease.out }}
      sx={{
        height: '100%',
        borderRadius: 3,
        background: `linear-gradient(90deg, ${palette.accentDark}, ${palette.accent})`,
      }}
    />
  </Box>
);

const HeroTwinVisual = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const [tick, setTick] = useState(72);
  useEffect(() => {
    const id = setInterval(() => setTick(68 + Math.round(Math.random() * 8)), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      sx={{ position: 'relative', perspective: 1400 }}
    >
      {/* Orbit ring */}
      <Box
        component={motion.div}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        sx={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          border: `1px dashed ${palette.border}`,
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      <Box
        component={motion.div}
        style={{ rotateX, rotateY }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        sx={{ transformStyle: 'preserve-3d' }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: ease.out }}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: `${radii.xl}px`,
            border: `1px solid ${palette.border}`,
            boxShadow: `${shadows.xl}, 0 0 0 1px rgba(255,255,255,0.6) inset`,
            bgcolor: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, background: gradients.cardHover, pointerEvents: 'none' }} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${palette.accentDark}, ${palette.accent}, transparent)`,
            }}
          />

          {/* Floating badges */}
          <Box
            component={motion.div}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              px: 1.75,
              py: 0.75,
              borderRadius: `${radii.lg}px`,
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${palette.border}`,
              boxShadow: shadows.md,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              zIndex: 3,
            }}
          >
            <FiberManualRecord sx={{ fontSize: 10, color: palette.success }} />
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700 }}>Live sync</Typography>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 1, duration: 0.6 },
              x: { delay: 1, duration: 0.6, ease: ease.out },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
            }}
            sx={{
              position: 'absolute',
              bottom: 24,
              left: -12,
              px: 2,
              py: 1.25,
              borderRadius: `${radii.lg}px`,
              bgcolor: palette.textPrimary,
              color: '#FCFBF8',
              boxShadow: shadows.lg,
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TrendingUp sx={{ fontSize: 16, color: palette.accent }} />
            <Box>
              <Typography sx={{ fontSize: '0.6rem', opacity: 0.7, fontWeight: 600 }}>Risk score</Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, lineHeight: 1 }}>23 · Low</Typography>
            </Box>
          </Box>

          <Stack spacing={2.5} sx={{ position: 'relative' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="overline" sx={{ color: palette.textLabel }}>
                Twin Environment Snapshot
              </Typography>
              <Chip label="Synced" size="small" sx={{ bgcolor: palette.accentLight, color: palette.accentDark, fontWeight: 700 }} />
            </Stack>

            {/* Mini chart */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 72 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              sx={{
                borderRadius: `${radii.lg}px`,
                border: `1px solid ${palette.border}`,
                bgcolor: 'rgba(255,255,255,0.6)',
                p: 1.5,
                overflow: 'hidden',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: palette.textSecondary }}>
                  Cluster throughput
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: palette.accentDark }}>
                  {tick}%
                </Typography>
              </Stack>
              <ResponsiveContainer width="100%" height={44}>
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={palette.accent} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={palette.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={palette.accentDark} strokeWidth={2} fill="url(#heroSpark)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>

            {rows.map((row, i) => (
              <Box
                key={row.label}
                component={motion.div}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.4 + i * 0.1, ease: ease.out }}
                whileHover={{ scale: 1.02, x: 4 }}
                sx={{
                  p: 2,
                  borderRadius: `${radii.lg}px`,
                  bgcolor: 'rgba(255,255,255,0.75)',
                  border: `1px solid ${palette.border}`,
                  transition: 'box-shadow 0.25s ease',
                  '&:hover': { boxShadow: shadows.md },
                }}
              >
                <Typography variant="caption" sx={{ color: palette.textLabel, fontWeight: 600 }}>
                  {row.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: palette.textPrimary, mt: 0.35 }}>
                  {row.value}
                </Typography>
                <AnimatedBar value={row.load} delay={i} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroTwinVisual;
