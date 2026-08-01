import { Box, Button, Container, Grid, Stack, Typography, Chip } from '@mui/material';
import {
  ArrowForward,
  Hub,
  Layers,
  Shield,
  Timeline,
  AutoGraph,
  Savings,
  Verified,
  PlayCircleOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MarketingNavbar from '../components/marketing/MarketingNavbar';
import FloatingBackground from '../components/marketing/FloatingBackground';
import HeroTwinVisual from '../components/marketing/HeroTwinVisual';
import TrustMarquee from '../components/marketing/TrustMarquee';
import GradientText from '../components/marketing/GradientText';
import GlowButton from '../components/marketing/GlowButton';
import SpotlightCard from '../components/marketing/SpotlightCard';
import ScrollReveal, { AnimatedCounter } from '../components/ui/ScrollReveal';
import { gradients, palette, shadows, radii, badgeStyle, iconCircleStyle, layout, transitions } from '../theme/colors';
import { ease, fadeUp, staggerContainer } from '../theme/motion';

const workflow = [
  { step: '01', title: 'Connect your cluster', desc: 'Register Kubernetes environments and sync live topology, workloads, and resource metadata.' },
  { step: '02', title: 'Run digital twin simulations', desc: 'Model scaling events, failures, rollouts, and traffic shifts without touching production.' },
  { step: '03', title: 'Decide with confidence', desc: 'Review risk scores, cost projections, and AI recommendations before you deploy.' },
];

const capabilities = [
  { icon: Hub, title: 'Cluster Topology Mirror', desc: 'A live map of nodes, services, ingress, and dependencies across your Kubernetes estate.', wide: true },
  { icon: Timeline, title: 'Deployment Simulation', desc: 'Validate rollout strategies, replica changes, and blast radius in an isolated twin environment.' },
  { icon: AutoGraph, title: 'Predictive Intelligence', desc: 'Forecast utilization, spend, and failure probability using trend-aware models.' },
  { icon: Shield, title: 'Risk Scoring Engine', desc: 'Surface configuration gaps, single points of failure, and policy violations early.' },
  { icon: Savings, title: 'Cloud Cost Forecasting', desc: 'Break down compute, storage, and network spend with forward-looking estimates.' },
  { icon: Layers, title: 'Role-Based Operations', desc: 'Purpose-built views for DevOps, cloud, SRE, and engineering leadership teams.', wide: true },
];

const audiences = [
  { title: 'Platform & DevOps teams', desc: 'Reduce release anxiety with pre-production validation and operational visibility.' },
  { title: 'Cloud & FinOps leaders', desc: 'Align infrastructure decisions with budget guardrails and capacity planning.' },
  { title: 'Reliability engineers', desc: 'Stress-test failure modes and monitor service health from one control surface.' },
];

const stats = [
  { value: '99.98', suffix: '%', label: 'Observed platform availability' },
  { value: '8', suffix: '', label: 'Core microservices orchestrated' },
  { value: '50', suffix: 'ms', label: 'Median API response time', prefix: '<' },
  { value: '24', suffix: '/7', label: 'Continuous cluster monitoring' },
];

const MotionBox = motion.create(Box);

const SectionHeading = ({ overline, title, desc, align = 'center' }) => (
  <ScrollReveal y={28} blur={4}>
    <Box sx={{ textAlign: align, maxWidth: 720, mx: align === 'center' ? 'auto' : 0, mb: 8 }}>
      <Box
        component={motion.div}
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.out }}
        sx={{ height: 3, bgcolor: palette.accent, borderRadius: 2, mb: 2, mx: align === 'center' ? 'auto' : 0 }}
      />
      <Typography variant="overline" sx={{ color: palette.textLabel, mb: 2, display: 'block' }}>
        {overline}
      </Typography>
      <Typography variant="h2" sx={{ color: palette.textPrimary, mb: 2, lineHeight: 0.92, letterSpacing: '-0.04em' }}>
        {title}
      </Typography>
      {desc && (
        <Typography sx={{ color: palette.textSecondary, fontSize: '1.125rem', lineHeight: 1.7 }}>{desc}</Typography>
      )}
    </Box>
  </ScrollReveal>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: palette.background, color: palette.textPrimary, overflow: 'hidden' }}>
      <MarketingNavbar />

      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          pt: { xs: 10, md: 14 },
          pb: layout.sectionPaddingY,
          minHeight: { md: '95vh' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FloatingBackground intense />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, lg: 6 }}>
              <MotionBox component={motion.div} variants={staggerContainer} initial="hidden" animate="visible">
                <MotionBox variants={fadeUp} custom={0}>
                  <Chip
                    icon={<Verified sx={{ fontSize: 16 }} />}
                    label="Enterprise Kubernetes Digital Twin"
                    sx={{
                      mb: 3,
                      ...badgeStyle,
                      px: 0.5,
                      fontSize: '0.7rem',
                      animation: 'borderPulse 4s ease-in-out infinite',
                    }}
                  />
                </MotionBox>

                <MotionBox variants={fadeUp} custom={1}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: '3rem', sm: '3.75rem', md: '5rem' },
                      fontWeight: 800,
                      lineHeight: 0.9,
                      letterSpacing: '-0.045em',
                      color: palette.textPrimary,
                      mb: 3,
                    }}
                  >
                    Know the impact
                    <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                      <GradientText>before you ship.</GradientText>
                    </Box>
                  </Typography>
                </MotionBox>

                <MotionBox variants={fadeUp} custom={2}>
                  <Typography
                    sx={{
                      fontSize: { xs: '1.05rem', md: '1.25rem' },
                      color: palette.textSecondary,
                      lineHeight: 1.75,
                      maxWidth: 520,
                      mb: 5,
                    }}
                  >
                    TwinDigital mirrors your Kubernetes infrastructure so teams can simulate deployments, quantify risk, and forecast cloud costs with enterprise-grade clarity.
                  </Typography>
                </MotionBox>

                <MotionBox variants={fadeUp} custom={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <GlowButton endIcon={<ArrowForward />} onClick={() => navigate('/login')}>
                      Start exploring
                    </GlowButton>
                    <Button
                      component={motion.button}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      variant="outlined"
                      size="large"
                      startIcon={<PlayCircleOutline />}
                      onClick={() => navigate('/login')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: `${radii.pill}px`,
                        border: `1px solid ${palette.border}`,
                        bgcolor: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      View live console
                    </Button>
                  </Stack>
                </MotionBox>

                <MotionBox variants={fadeUp} custom={4}>
                  <Stack direction="row" spacing={3} sx={{ mt: 5, flexWrap: 'wrap', gap: 2 }}>
                    {['Zero prod risk', 'Live topology', 'AI forecasts'].map((tag, i) => (
                      <Typography
                        key={tag}
                        component={motion.span}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        sx={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: palette.textMuted,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          '&::before': {
                            content: '""',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: palette.accent,
                          },
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Stack>
                </MotionBox>
              </MotionBox>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <HeroTwinVisual />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <TrustMarquee />

      {/* Stats — glass bento strip */}
      <Box component="section" sx={{ py: layout.sectionPaddingY, bgcolor: palette.section, position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <ScrollReveal delay={i * 0.07} y={20}>
                  <Box
                    component={motion.div}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    sx={{
                      textAlign: 'center',
                      p: 3.5,
                      borderRadius: `${radii.xl}px`,
                      bgcolor: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${palette.border}`,
                      boxShadow: shadows.card,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '20%',
                        right: '20%',
                        height: 2,
                        bgcolor: i === 0 ? palette.accent : 'transparent',
                        background: i === 0 ? undefined : `linear-gradient(90deg, transparent, ${palette.accent}44, transparent)`,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '2.25rem', md: '3rem' },
                        fontWeight: 800,
                        color: palette.textPrimary,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {stat.prefix === '<' ? '<' : ''}
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </Typography>
                    <Typography sx={{ mt: 1.5, color: palette.textSecondary, fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Workflow — connected timeline */}
      <Box component="section" sx={{ py: layout.sectionPaddingY, bgcolor: palette.backgroundAlt, position: 'relative' }}>
        <Container maxWidth="lg">
          <SectionHeading
            overline="How it works"
            title="From cluster mirror to deployment decision"
            desc="A focused workflow designed for teams who need operational certainty without slowing delivery."
          />
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 48,
                left: '16%',
                right: '16%',
                height: 2,
                background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)`,
              }}
            />
            <Grid container spacing={layout.cardGap}>
              {workflow.map((item, i) => (
                <Grid key={item.step} size={{ xs: 12, md: 4 }}>
                  <SpotlightCard delay={i * 0.1}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: palette.accent,
                        color: '#111111',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        mb: 2.5,
                        boxShadow: shadows.button,
                      }}
                    >
                      {item.step}
                    </Box>
                    <Typography variant="h5" sx={{ color: palette.textPrimary, mb: 1.5, letterSpacing: '-0.02em' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: palette.textSecondary, lineHeight: 1.7 }}>{item.desc}</Typography>
                  </SpotlightCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Capabilities — bento grid */}
      <Box component="section" sx={{ py: layout.sectionPaddingY, bgcolor: palette.section }}>
        <Container maxWidth="lg">
          <SectionHeading
            overline="Capabilities"
            title="Everything required to operate with confidence"
            desc="Purpose-built modules for topology visibility, simulation, prediction, risk, and cost — unified in one premium console."
            align="left"
          />
          <Grid container spacing={3}>
            {capabilities.map((item, i) => (
              <Grid key={item.title} size={{ xs: 12, sm: item.wide ? 12 : 6, lg: item.wide ? 6 : 4 }}>
                <SpotlightCard delay={(i % 3) * 0.06} accent={item.wide && i === 0}>
                  <Stack direction={item.wide ? { xs: 'column', sm: 'row' } : 'column'} spacing={3} alignItems={item.wide ? 'center' : 'flex-start'}>
                    <Box
                      component={motion.div}
                      whileHover={{ rotate: -8, scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      sx={{
                        width: 56,
                        height: 56,
                        flexShrink: 0,
                        ...iconCircleStyle,
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: shadows.button,
                      }}
                    >
                      <item.icon sx={{ color: '#111111' }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: item.wide && i === 0 ? '#FCFBF8' : palette.textPrimary,
                          mb: 1.5,
                          letterSpacing: '-0.02em',
                          fontSize: item.wide ? '1.35rem' : undefined,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: item.wide && i === 0 ? 'rgba(252,251,248,0.75)' : palette.textSecondary,
                          lineHeight: 1.7,
                          maxWidth: item.wide ? 480 : undefined,
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </SpotlightCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Audiences */}
      <Box component="section" sx={{ py: layout.sectionPaddingY, bgcolor: palette.backgroundAlt }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <SectionHeading
                overline="Built for modern infra teams"
                title="One platform, multiple operational lenses"
                desc="Role-aware dashboards help each stakeholder focus on the signals that matter most to their decisions."
                align="left"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                {audiences.map((item, i) => (
                  <ScrollReveal key={item.title} delay={i * 0.1}>
                    <Box
                      component={motion.div}
                      whileHover={{ x: 10, scale: 1.01 }}
                      transition={{ duration: 0.28, ease: ease.out }}
                      sx={{
                        p: 3.5,
                        borderRadius: `${radii.xl}px`,
                        border: `1px solid ${palette.border}`,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: shadows.sm,
                        borderLeft: `3px solid ${palette.accent}`,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: palette.textPrimary, mb: 1, letterSpacing: '-0.02em' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: palette.textSecondary, lineHeight: 1.7 }}>{item.desc}</Typography>
                    </Box>
                  </ScrollReveal>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        component="section"
        sx={{
          py: layout.sectionPaddingY,
          background: gradients.hero,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component={motion.div}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 600,
            height: 600,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: `1px solid rgba(199,255,58,0.12)`,
            pointerEvents: 'none',
          }}
        />
        <Box
          component={motion.div}
          animate={{ opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: 6, repeat: Infinity }}
          sx={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${palette.accent}33, transparent 55%)`,
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <ScrollReveal y={40}>
            <Box
              sx={{
                textAlign: 'center',
                color: '#FCFBF8',
                px: { xs: 1, md: 4 },
                py: { xs: 4, md: 6 },
                borderRadius: `${radii.xl}px`,
                border: '1px solid rgba(255,255,255,0.08)',
                bgcolor: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: '#FCFBF8',
                  mb: 2,
                  fontSize: { xs: '2.25rem', md: '3.25rem' },
                  lineHeight: 0.92,
                  letterSpacing: '-0.04em',
                }}
              >
                Deploy smarter with a trusted digital twin
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(252,251,248,0.72)',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  maxWidth: 640,
                  mx: 'auto',
                  mb: 4,
                }}
              >
                Move from guesswork to evidence-backed infrastructure decisions. Launch the console and explore your operational twin today.
              </Typography>
              <GlowButton endIcon={<ArrowForward />} onClick={() => navigate('/login')} sx={{ px: 6, py: 1.75 }}>
                Launch TwinDigital Console
              </GlowButton>
            </Box>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 8, bgcolor: palette.background, borderTop: `1px solid ${palette.border}` }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={4}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: palette.textPrimary, mb: 1, letterSpacing: '-0.02em' }}>
                TwinDigital
              </Typography>
              <Typography sx={{ color: palette.textMuted, maxWidth: 360, lineHeight: 1.7 }}>
                Kubernetes digital twin platform for simulation, risk analysis, and cloud cost intelligence.
              </Typography>
            </Box>
            <Typography sx={{ color: palette.textLabel, alignSelf: { md: 'flex-end' } }}>
              © 2026 TwinDigital. All rights reserved.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
