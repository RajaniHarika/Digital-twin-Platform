import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Link,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
} from '@mui/material';
import {
  MenuBook,
  SupportAgent,
  ExpandMore,
  RocketLaunch,
  Hub,
  Email,
  OpenInNew,
  PlayCircleOutline,
  Shield,
  Speed,
} from '@mui/icons-material';
import authService from '../services/auth';
import { getSidebarItemsForRole } from '../utils/navigation';
import { useAppTheme } from '../theme/useAppTheme';
import { palette, radii, shadows } from '../theme/colors';

const faqs = [
  {
    q: 'How do I run a deployment simulation?',
    a: 'Open Simulation from the sidebar, click New Simulation, choose a target service and deployment strategy, then review the projected impact before applying changes in production.',
  },
  {
    q: 'Where can I see cluster topology?',
    a: 'Use Infrastructure / Cloud Topology from the sidebar to explore services, nodes, dependencies, and live health indicators across your digital twin.',
  },
  {
    q: 'How are risk scores calculated?',
    a: 'Risk Analysis combines configuration gaps, dependency exposure, resource pressure, and recent incident signals into a weighted score with actionable recommendations.',
  },
  {
    q: 'Can I forecast cloud spend?',
    a: 'Yes. Open Cost Analysis or Capacity Forecast to review current burn, category breakdown, and forward-looking estimates based on utilization trends.',
  },
  {
    q: 'Who do I contact for access issues?',
    a: 'Reach your platform administrator or email support@digitaltwin.com with your assigned role and workspace details.',
  },
];

const quickGuides = [
  {
    icon: RocketLaunch,
    title: 'Getting started',
    desc: 'Sign in with your assigned role, open your dashboard, and review live cluster health before running simulations.',
  },
  {
    icon: Hub,
    title: 'Topology sync',
    desc: 'Mirror Kubernetes workloads and service dependencies to validate blast radius before changes.',
  },
  {
    icon: Shield,
    title: 'Risk & compliance',
    desc: 'Use risk scoring and audit history to track incidents, deployments, and policy violations.',
  },
  {
    icon: Speed,
    title: 'Performance insights',
    desc: 'Monitor CPU, memory, latency, and scaling signals from predictive analytics and dashboards.',
  },
];

const Help = () => {
  const navigate = useNavigate();
  const { tokens, isDark } = useAppTheme();
  const user = authService.getCurrentUser();
  const [expanded, setExpanded] = useState(false);

  const rolePages = useMemo(() => getSidebarItemsForRole(user?.role), [user?.role]);

  const cardSx = {
    p: 3,
    height: '100%',
    borderRadius: `${radii.xl}px`,
    border: `1px solid ${tokens.border}`,
    bgcolor: tokens.paper,
    boxShadow: tokens.shadowSm,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow,
    },
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: `${radii.xl}px`,
          border: `1px solid ${tokens.border}`,
          background: isDark
            ? `linear-gradient(135deg, ${alpha('#111111', 0.95)} 0%, ${alpha(palette.accent, 0.08)} 100%)`
            : `linear-gradient(135deg, ${palette.background} 0%, ${alpha(palette.accent, 0.12)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: 3,
            background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`,
          }}
        />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ md: 'center' }}>
          <Box>
            <Chip
              label="Support center"
              size="small"
              sx={{
                mb: 2,
                fontWeight: 700,
                bgcolor: tokens.accentLight,
                color: palette.accentDark,
                border: `1px solid ${alpha(palette.accent, 0.35)}`,
              }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.03em', mb: 1 }}>
              Help & Support
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.7 }}>
              Guides, FAQs, and platform resources for operating your Kubernetes digital twin with confidence.
            </Typography>
            {user?.role && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Signed in as <strong>{user.name}</strong> · {user.role}
              </Typography>
            )}
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<PlayCircleOutline />}
              onClick={() => navigate('/dashboard')}
              sx={{ borderRadius: `${radii.pill}px`, boxShadow: shadows.button, px: 3 }}
            >
              Open dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              href="mailto:support@digitaltwin.com"
              sx={{ borderRadius: `${radii.pill}px`, px: 3 }}
            >
              Contact support
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickGuides.map((guide) => (
          <Grid key={guide.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: tokens.accentLight,
                  color: palette.accentDark,
                  display: 'grid',
                  placeItems: 'center',
                  mb: 2,
                }}
              >
                <guide.icon />
              </Box>
              <Typography fontWeight={700} sx={{ mb: 0.75 }}>{guide.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                {guide.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${tokens.border}`, bgcolor: tokens.surfaceMuted }}>
              <Typography variant="h6" fontWeight={700}>Frequently asked questions</Typography>
              <Typography variant="caption" color="text.secondary">Common workflows across DevOps, cloud, and SRE teams</Typography>
            </Box>
            {faqs.map((item, index) => (
              <Accordion
                key={item.q}
                expanded={expanded === index}
                onChange={(_, isExpanded) => setExpanded(isExpanded ? index : false)}
                disableGutters
                elevation={0}
                sx={{
                  bgcolor: 'transparent',
                  '&:before': { display: 'none' },
                  borderBottom: index < faqs.length - 1 ? `1px solid ${tokens.border}` : 'none',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3 }}>
                  <Typography fontWeight={600}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {item.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={cardSx}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
                <MenuBook sx={{ color: palette.accentDark, mt: 0.25 }} />
                <Box>
                  <Typography fontWeight={700}>Documentation</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.65 }}>
                    Deployment simulation, risk scoring, cost forecasting, and topology mapping guides.
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                endIcon={<OpenInNew />}
                href="https://github.com/RajaniHarika/Digital-twin-Platform"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: `${radii.lg}px` }}
              >
                View project docs
              </Button>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
                <SupportAgent sx={{ color: palette.accentDark, mt: 0.25 }} />
                <Box>
                  <Typography fontWeight={700}>Platform support</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.65 }}>
                    Need help with access, integrations, or production rollout? Our support team responds within one business day.
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2">
                  Email:{' '}
                  <Link href="mailto:support@digitaltwin.com" fontWeight={600}>
                    support@digitaltwin.com
                  </Link>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Include your role, workspace, and a short description of the issue.
                </Typography>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <Typography fontWeight={700} sx={{ mb: 1.5 }}>Your console pages</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Quick links based on your current role access.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {rolePages.map((page) => (
                  <Chip
                    key={page.path}
                    label={page.label}
                    clickable
                    onClick={() => navigate(page.path)}
                    sx={{
                      fontWeight: 600,
                      bgcolor: tokens.accentLight,
                      color: palette.accentDark,
                      '&:hover': { bgcolor: alpha(palette.accent, 0.22) },
                    }}
                  />
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Help;
