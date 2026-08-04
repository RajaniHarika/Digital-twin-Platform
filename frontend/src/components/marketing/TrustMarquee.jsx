import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { palette } from '../../theme/colors';

const logos = [
  'Kubernetes',
  'Prometheus',
  'Grafana',
  'Jenkins',
  'Docker',
  'Terraform',
  'AWS',
  'Istio',
];

const TrustMarquee = () => (
  <Box sx={{ py: 4, borderTop: `1px solid ${palette.border}`, borderBottom: `1px solid ${palette.border}`, bgcolor: palette.section, overflow: 'hidden' }}>
    <Typography
      variant="overline"
      sx={{ display: 'block', textAlign: 'center', color: palette.textLabel, mb: 3, letterSpacing: '0.12em' }}
    >
      Integrates with your stack
    </Typography>
    <Box sx={{ position: 'relative', maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
      <Box
        component={motion.div}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        sx={{ display: 'flex', width: 'max-content', gap: 6, px: 3 }}
      >
        {[...logos, ...logos].map((name, i) => (
          <Typography
            key={`${name}-${i}`}
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              color: palette.textMuted,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              opacity: 0.7,
            }}
          >
            {name}
          </Typography>
        ))}
      </Box>
    </Box>
  </Box>
);

export default TrustMarquee;
