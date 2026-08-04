import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { ArrowBack, Hub, VerifiedUser, Speed, Insights } from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../services/auth';
import LoginForm from '../components/LoginForm';
import FloatingBackground from '../components/marketing/FloatingBackground';
import { useAppTheme } from '../theme/useAppTheme';
import { gradients, palette, shadows, radii } from '../theme/colors';
import { ease, fadeUp, staggerContainer } from '../theme/motion';

const highlights = [
  { icon: VerifiedUser, text: 'JWT-secured role-based access' },
  { icon: Speed, text: 'Live cluster metrics and topology sync' },
  { icon: Insights, text: 'Simulation, risk, and cost intelligence' },
];

const MotionBox = motion.create(Box);

const Login = () => {
  const navigate = useNavigate();
  const { tokens } = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleLoginSubmit = async ({ email, password, role, rememberMe }) => {
    setIsLoading(true);
    setApiError('');
    try {
      await authService.login(email, password, role, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: tokens.bg, position: 'relative', overflow: 'hidden' }}>
      <FloatingBackground />
      <Container maxWidth="lg" sx={{ minHeight: '100vh', py: { xs: 3, md: 4 }, position: 'relative' }}>
        <MotionBox
          component={motion.div}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: ease.out }}
        >
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ color: tokens.textSecondary, mb: { xs: 3, md: 4 }, fontWeight: 600 }}
          >
            Back to home
          </Button>
        </MotionBox>

        <Grid container spacing={6} alignItems="stretch" sx={{ minHeight: { md: 'calc(100vh - 120px)' } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox
              component={motion.div}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: ease.out }}
              sx={{
                height: '100%',
                p: { xs: 4, md: 6 },
                borderRadius: `${radii.xl}px`,
                background: gradients.hero,
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: shadows.xl,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                component={motion.div}
                animate={{ opacity: [0.04, 0.1, 0.04] }}
                transition={{ duration: 6, repeat: Infinity }}
                sx={{
                  position: 'absolute',
                  top: -80,
                  right: -80,
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  bgcolor: palette.accent,
                  filter: 'blur(60px)',
                }}
              />
              <Box sx={{ position: 'relative' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
                  <Box
                    component={motion.div}
                    whileHover={{ rotate: 8, scale: 1.05 }}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: palette.accent,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Hub sx={{ color: '#111111' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                      TwinDigital
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                      Operations Console
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    mb: 2,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                  }}
                >
                  Secure access to your infrastructure digital twin
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, maxWidth: 480, fontSize: '1.0625rem' }}>
                  Sign in with your assigned role to open dashboards, simulations, topology views, and predictive insights.
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ mt: 6, position: 'relative' }}>
                {highlights.map((item, i) => (
                  <MotionBox
                    key={item.text}
                    component={motion.div}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: palette.accent,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <item.icon sx={{ fontSize: 20, color: '#111111' }} />
                      </Box>
                      <Typography sx={{ fontWeight: 500, color: 'rgba(255,255,255,0.92)' }}>{item.text}</Typography>
                    </Stack>
                  </MotionBox>
                ))}
              </Stack>
            </MotionBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <MotionBox
                component={motion.div}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                sx={{ width: '100%' }}
              >
                <MotionBox variants={fadeUp} custom={0}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 4, sm: 5 },
                      borderRadius: `${radii.xl}px`,
                      border: `1px solid ${tokens.border}`,
                      boxShadow: tokens.shadow,
                      bgcolor: tokens.paper,
                      backdropFilter: 'blur(20px)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '15%',
                        right: '15%',
                        height: 2,
                        background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: tokens.text, mb: 1, letterSpacing: '-0.03em' }}
                    >
                      Welcome back
                    </Typography>
                    <Typography sx={{ color: tokens.textSecondary, mb: 4, lineHeight: 1.7 }}>
                      Enter your credentials to access the TwinDigital console.
                    </Typography>

                    <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} apiError={apiError} />
                  </Paper>
                </MotionBox>
              </MotionBox>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
